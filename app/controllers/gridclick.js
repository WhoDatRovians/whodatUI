$(document).ready(function () {
    
    var messageList;
    
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    
    window.addEventListener("load", function () {
        // Set a timeout...
        setTimeout(function () {
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 0);
    });
    
    //var celebJson = '{"Credits": {"credit_id": 6780301,"full_name": "Alfred Molina","part_name": "Roadkill","long_title": "Rango","zodiac_sign": "Gemini","file_url": "http://cps-static.rovicorp.com/2/Open/Getty/Alfred%20Molina/_derived_jpg_q90_600x800_m0/75443844.jpg"}}';
    var celebrity;
    getCeleberity();
    
    var originalTitle;
    function startGame(celebJson) {
        if (celebJson === "") {
            celebJson = '{"Credits": {"credit_id": 6780301,"full_name": "Alfred Molina","part_name": "Roadkill","long_title": "Rango","zodiac_sign": "Gemini","file_url": "http://cps-static.rovicorp.com/2/Open/Getty/Alfred%20Molina/_derived_jpg_q90_600x800_m0/75443844.jpg"}}';
        }
        celebrity = JSON && JSON.parse(celebJson) || $.parseJSON(celebJson);
        
        var titleArray = celebrity.Credits.fullname.split("");
        originalTitle = titleArray;
        $('#answer input').remove();
        $('#answer br').remove();
        $('#characters input').remove();
        $('#characters br').remove();
        for (var i = 0; i < titleArray.length; i++) {

            if (titleArray[i] != " ") {
                var inputString = '';
                if (isAlphaNumeric(titleArray[i]) === false) {
                    inputString = '<input type="text" maxlength="1" id="mt_' + i + '" style="background-color:#98ACC8; color:#fff;" value="' + titleArray[i] + '"></input>';
                } else {
                    inputString = '<input type="text" maxlength="1" id="mt_' + i + '"></input>';
                }

                $('#answer').append(inputString);

            } else {

                if (isMobile.any()) {
                    $('#answer').append('</br>');
                }
                $('#answer').append('<input type="text" maxlength="1" id="mt_blank" style="background:#a0cf89;" disabled>' + titleArray[i] + '</input>');

            }
        }
        
        //$(':input').autotab_magic();
        var maxchars = 1;
        $(':input').keydown(function (e) {
            if ($(this).val().length >= 2) {
                $(this).val($(this).val().substr(0, maxchars));
            }
        });

        $(':input').keyup(function (e) {
            if ($(this).val().length >= 2) {
                $(this).val($(this).val().substr(0, maxchars));
            }
            validateInput(this);
        });
        
        titleArray = scramble(celebrity.Credits.fullname).split("");
        for (i = 0; i < titleArray.length; i++) {

            if (titleArray[i] != " ") {
                var characterString = '';
                if (isAlphaNumeric(titleArray[i]) === false) {
                    characterString = '<input type="text" maxlength="1" id="mt_' + i + '" style="background-color:#98ACC8; color:#fff;" value="' + titleArray[i] + '"></input>';
                } else {
                    characterString = '<input type="text" maxlength="1" id="mt_' + i + '" value="' + titleArray[i] + '" disabled></input>';
                }

                $('#characters').append(characterString);

            } else {

                if (isMobile.any()) {
                    $('#characters').append('</br>');
                }
                //$('#characters').append('<input type="text" maxlength="1" id="mt_blank" style="background:#a0cf89;" disabled>' + titleArray[i] + '</input>');

            }
        }
        
    }

    function getCeleberity() {
        var apiUrl = 'http://localhost:2826/api/values';
        $.ajax({
            url: apiUrl,
            dataType: 'jsonp',
            crossDomain: true,
            error: function (e) {
                console.log(e.message);
            },
            success: function (data) {
                startGame(data);
            }
        });
    }
    function validateInput(input) {
        var arrayId = input.id.replace('mt_', '');
        var inputValue = input.value;
        var originalValue = originalTitle[arrayId];

        if (inputValue.toString().toLowerCase() === originalValue.toString().toLowerCase()) {
            $(input).css("background-color", '#98ACC8');
            $(input).css("color", '#fff');
        } else {
            $(input).css("background-color", '#fff');
            $(input).css("color", '#F00');
        }
        checkAnswer();
    }
    function getMessages() {
        $.getJSON("app/stores/messages.txt", function (data) {

            $.each(data.messages, function (key, val) {

                messageList.push(val);

            });
        });
    }
    function checkAnswer() {
        var inputs = $('#answer input');
        var allInputsValid = true;
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].id != "mt_blank") {
                var color = $(inputs[i]).css("background-color");
                if (color != 'rgb(152, 172, 200)') {
                    allInputsValid = false;
                    break;
                }
            }
        }
        if (allInputsValid === true) {
            showCorrect();
        }
    }
    function showCorrect() {
        var rand = messageList[Math.floor(Math.random() * messageList.length)];
        $('#correct').show();

        $('#correct_label').show();
        $('#correct_label').html(rand.name);

    }
    function displayAnswer() {
        var inputs = $('#answer input');
        var allInputsValid = true;
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];

            if (input.id != "mt_blank") {
                $(input).css("background-color", '#98ACC8');
                $(input).css("color", '#fff');
                input.value = originalTitle[i];
            }
        }
    }
    function scramble(str) {
        var scrambled = '', randomNum;
        while (str.length > 1) {
            randomNum = Math.floor(Math.random() * str.length);
            scrambled += str.charAt(randomNum);
            if (randomNum == 0) {
                str = str.substr(randomNum + 1);
            }
            else if (randomNum == (str.length - 1)) {
                str = str.substring(0, str.length - 1);
            }
            else {
                str = str.substring(0, randomNum) + str.substring(randomNum + 1);
            }
        }
        scrambled += str;
        return scrambled;
        //return s.replace(
        // /\b([a-z])([a-z]+)([a-z])\b/gi,
        // function (t, a, b, c) {
        //     b = b.split(/\B/);
        //     for (var i = b.length, j, k; i; j = parseInt(Math.random() * i),
        //      k = b[--i], b[i] = b[j], b[j] = k) { }
        //     return a + b.join('') + c;
        // }
        //);
    }
    function isAlphaNumeric(x) {

        var regex = /^[a-zA-Z0-9]+$/g;

        if (regex.test(x)) {
            return true;
        } else
            return false;
    }
    
   $('.ui-btnsolid').click(function (){
           $(this).toggleClass('ui-btnsolid').toggleClass('ui-btntranspo');
		   
   });
    
    $('.ui-btntranspo').click(function (){
             $(this).toggleClass('ui-btntranspo').toggleClass('ui-btnsolid');
      });
    
});