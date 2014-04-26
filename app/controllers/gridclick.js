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
        
        celebrity = JSON && JSON.parse(celebJson) || $.parseJSON(celebJson);
        
        var titleArray = celebrity.Credits.fullname.split("");
        originalTitle = titleArray;
        var imageUrl = celebrity.Credits.imageurl;
        var myElements = document.querySelectorAll("#grid");
        myElements[0].style.backgroundImage = "url(" + imageUrl + ")";
        
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

            }
        }
        $(':input').autotab_magic();
    }

    function getCeleberity() {
        var apiUrl = 'http://localhost:2826/api/values';
        $.ajax({
            url: apiUrl,
            dataType: 'jsonp',
            crossDomain: true,
            error: function (e) {
                var celebJson = '{"Credits": {"creditid": 6780301,"fullname": "Alfred Molina","partname": "Roadkill","longtitle": "Rango","zodiacsign": "Gemini","imageurl": "http://cps-static.rovicorp.com/2/Open/Getty/Alfred%20Molina/_derived_jpg_q90_600x800_m0/75443844.jpg"}}';
                startGame(celebJson);
                console.log(e.message);
            },
            success: function (data) {
                startGame(data);
            }
        });
        var celebJson = '{"Credits": {"creditid": 6780301,"fullname": "Alfred Molina","partname": "Roadkill","longtitle": "Rango","zodiacsign": "Gemini","imageurl": "http://cps-static.rovicorp.com/2/Open/Getty/Alfred%20Molina/_derived_jpg_q90_600x800_m0/75443844.jpg"}}';
        startGame(celebJson);
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

    getMessages();
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
        //var rand = messageList[Math.floor(Math.random() * messageList.length)];
        $('#correct').show();

        $('#correct_label').show();
        //$('#correct_label').html(rand.name);
        showImage();

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
        
    }
    function isAlphaNumeric(x) {

        var regex = /^[a-zA-Z0-9]+$/g;

        if (regex.test(x)) {
            return true;
        } else
            return false;
    }
    
    $('.ui-btnsolid').click(function (){
        setNeighborTiles(this);
    });
    $('.ui-btntranspo').click(function () {
        setNeighborTiles(this);
    });


    function setNeighborTiles(cell) {
        $('#cell1').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        $('#cell2').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        $('#cell3').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        $('#cell4').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        $('#cell5').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        $('#cell6').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        $('#cell7').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        $('#cell8').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        $('#cell9').removeClass('ui-btntranspo').addClass('ui-btnsolid');
        
        
        $(cell).removeClass('ui-btnsolid').addClass('ui-btntranspo');
    }

    function showImage() {
        $('#cell1').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        $('#cell2').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        $('#cell3').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        $('#cell4').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        $('#cell5').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        $('#cell6').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        $('#cell7').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        $('#cell8').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        $('#cell9').removeClass('ui-btnsolid').addClass('ui-btntranspo');
        
        $('#grid').removeClass('blurimage').addClass('clearimage');
    }
    
});