$(document).ready(function () {
    
    var messageList = [];
    
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
    
    var celebrity;
    var creditCounter = 0;
    var originalTitle;
    var hints = [];
    var clickedInputs = [];
    var networkFailure = false;
    getCeleberity();
    function getCeleberity() {
        var apiUrl = 'http://localhost:2826/api/values';
        if (networkFailure === false)
            $.ajax({
                url: apiUrl,
                dataType: 'jsonp',
                crossDomain: true,
                timeout: 5000,
                error: function(e) {
                    networkFailure = true;
                    $.getJSON("app/stores/SampleCelebrities.txt", function (data) {
                        startGame(data);
                    });
                },
                success: function(data) {
                    var celebJson = JSON && JSON.parse(data) || $.parseJSON(data);
                    startGame(celebJson);
                },
                statusCode: {
                    404: function() {
                        alert("page not found");
                    }
                }
            });
        
        if(networkFailure === true) {
            $.getJSON("app/stores/SampleCelebrities.txt", function (data) {
                startGame(data);
            });
        }
    }

    function startGame(celebJson) {
        celebrity = celebJson;
        
        if (creditCounter >= celebrity.Credits.length)
            creditCounter = 0;

        var credit = celebrity.Credits[creditCounter];
        loadHints(credit);
        var titleArray = credit.fullname.split("");
        creditCounter = creditCounter + 1;
        originalTitle = titleArray;
        clickedInputs = [];
        var imageUrl = credit.imageurl;
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
                    inputString = '<input type="text" maxlength="1" id="mt_' + i + '" style="background-color:#98ACC8; color:#fff;" value="' + titleArray[i] + '" disabled></input>';
                } else {
                    inputString = '<input type="text" maxlength="1" id="mt_' + i + '" disabled></input>';
                }

                $('#answer').append(inputString);

            } else {

                if (isMobile.any()) {
                    $('#answer').append('</br>');
                }
                $('#answer').append('<input type="text" maxlength="1" id="mt_blank" style="background:#96d1cc;" disabled>' + titleArray[i] + '</input>');

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
            checkLen(1, $(this).val());
        });
        
        titleArray = scramble(credit.fullname).split("");
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
            
            $('#characters').click(function (e) {
                e = window.event || e;
                var targ = e.target || e.srcElement;
                
                var inputExist = false;

                for (var j = 0; j < clickedInputs.length; j++) {
                    if (clickedInputs[j] === $(targ)[0].id) {
                        inputExist = true;
                        break;
                    }
                }
                if (inputExist === false) {
                    clickedInputs[clickedInputs.length] = $(targ)[0].id;
                    $($(targ)[0]).css("background-color", '#98ACC8');
                    checkInputs($(targ)[0].value);
                }
            });
        }

        startCounting();
        resetSelections();
    }

    function loadHints(credit) {
        hints = [];

        hints[0] = "This actor's zodiac sign is: " + credit.zodiacsign;
        hints[1] = "This actor's acted in a movie: " + credit.longtitle;
        hints[2] = "This actor's part name was: " + credit.partname;
        
    }

    function startCounting() {
        var now = new Date();
        now.setSeconds(now.getSeconds() + 60);

        $('#timer').countdown({ until: now, format: 'S', compact: true, onExpiry: doneCounting, onTick: watchCountdown });
    }
    function watchCountdown(periods) {
        var mins = '00';
        var secs = '00';
        if (periods[5].toString().length === 1)
            mins = 'TL: 0' + periods[5].toString();
        else
            mins = 'TL: ' + periods[5].toString();
        
        if (periods[6].toString().length === 1)
            secs = ':0' + periods[6].toString();
        else
            secs = ':' + periods[6].toString();

        $('#timer').text(mins + secs);
        
        if (periods[6] > 45) {
            $('#hints')[0].innerHTML = '';
        }
        if (periods[6] <= 45 && periods[6] > 30) {
            $('#hints')[0].innerHTML = 'Hints: ' + hints[0];
        }
        if (periods[6] <= 30 && periods[6] > 15) {
            $('#hints')[0].innerHTML = 'Hints: ' + hints[1];
        }
        if (periods[6] <= 15 && periods[6] > 0) {
            $('#hints')[0].innerHTML = 'Hints: ' + hints[2];
        }
        if (periods[6] <= 0) {
            displayAnswer();
            showImage();
        }
    }
    function doneCounting() {
        console.log("done counting");
        $('#timer').countdown('destroy');
        $('#timer')[0].innerHTML = 'TL: 00:00';
    }
    function checkInputs(value) {
        var inputs = $('#answer input');
        
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].id != "mt_blank" && inputs[i].value === "") {
                inputs[i].value = value;
                validateInput(inputs[i]);
                break;
            }
        }
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
        doneCounting();
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
        doneCounting();
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

    function resetSelections() {
        clickedInputs = [];
        var inputs = $('#answer input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (input.id != "mt_blank") {
                inputs[i].value = "";
                $(input).css("background-color", '#fff');
            }
        }
        var charInputs = $('#characters input');
        for (var j = 0; j < charInputs.length; j++) {
            var charInput = charInputs[j];
            if (charInputs.id != "mt_blank") {                
                $(charInput).css("background-color", '#fff');
            }
        }
    }
    $('.ui-btnsolid').click(function (){
        setNeighborTiles(this);
    });
    $('.ui-btntranspo').click(function () {
        setNeighborTiles(this);
    });
    $('#nav_button').click(function () {
        setNeighborTiles("#cell1");
        getCeleberity();
        $('#grid').removeClass('clearimage').addClass('blurimage');
    });
    $('#resetBtn').click(function () {
        resetSelections();
    });
    $('#GiveUp').click(function () {
        
        displayAnswer();
        showImage();
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
