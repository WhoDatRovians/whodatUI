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
    
    var celebsJson = '{"Credits": [{"credit_id": 6780301,"full_name": "Alfred Molina","part_name": "Roadkill","long_title": "Rango","zodiac_sign": "Gemini","file_url": "http://cps-static.rovicorp.com/2/Open/Getty/Alfred%20Molina/_derived_jpg_q90_600x800_m0/75443844.jpg"},'+
    '{"creditid":6766360,"fullname":"Matthew Morrison","partname":"Will Schuester","zodiacsign":"Scorpio","longtitle":"Glee","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Matthew%20Morrison/_3by4/_derived_jpg_q90_584x800_m0/93276439.jpg"},'+
    '{"creditid":15535258,"fullname":"Manu Bennett","partname":"Azog","zodiacsign":"Libra","longtitle":"The Hobbit: An Unexpected Journey","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Manu%20Bennett/_3by4/_derived_jpg_q90_584x800_m0/95786657.jpg"},'+
    '{"creditid":6780721,"fullname":"Elliott Gould","partname":"Dr. Ian Sussman","zodiacsign":"Virgo","longtitle":"Contagion","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Elliott%20Gould/_3by4/_derived_jpg_q90_584x800_m0/73414981.jpg"},'+
    '{"creditid":6766924,"fullname":"Sam Robards","partname":"Howie \"The Captain\" Archibald","zodiacsign":"Sagittarius","longtitle":"Gossip Girl","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Sam%20Robards/_3by4/_derived_jpg_q90_584x800_m0/73965937.jpg"},'+
    '{"creditid":6781486,"fullname":"Brendan Gleeson","partname":"David Barlow","zodiacsign":"Aries","longtitle":"Safe House","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Brendan%20Gleeson/_3by4/_derived_jpg_q90_584x800_m0/84692373.jpg"},'+
    '{"creditid":15418475,"fullname":"Isabelle Huppert","partname":"Hanna Giurgiu","zodiacsign":"Pisces","longtitle":"My Little Princess","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Isabelle%20Huppert/_3by4/_derived_jpg_q90_584x800_m0/99646870.jpg"},'+
    '{"creditid":15636397,"fullname":"Joey Starr","partname":"Fred","zodiacsign":"Scorpio","longtitle":"Polisse","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Joey%20Starr/_3by4/_derived_jpg_q90_584x800_m0/114162783.jpg"},'+
    '{"creditid":6781400,"fullname":"Anthony Mackie","partname":"Officer Coleman Harris","zodiacsign":"Virgo","longtitle":"Gangster Squad","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Anthony%20Mackie/_3by4/_derived_jpg_q90_584x800_m0/88265149.jpg"},'+
    '{"creditid":15376868,"fullname":"Matthew Macfadyen","partname":"Aramis","zodiacsign":"Libra","longtitle":"The Three Musketeers","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Matthew%20MacFadyen/_3by4/_derived_jpg_q90_584x800_m0/54838693.jpg"}'+
    '{"creditid":6765664,"fullname":"Emily Blunt","partname":"Elise Sellas","zodiacsign":"Pisces","longtitle":"The Adjustment Bureau","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Emily%20Blunt/_3by4/_derived_jpg_q90_584x800_m0/94265881.jpg"},'+
    '{"creditid":6780569,"fullname":"Brett Cullen","partname":"Tom Eckert","zodiacsign":"Virgo","longtitle":"Red Dawn","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Brett%20Cullen/_3by4/_derived_jpg_q90_584x800_m0/77502745.jpg"},'+
    '{"creditid":6778844,"fullname":"Brad Pitt","partname":"Jackie","zodiacsign":"Sagittarius","longtitle":"Killing Them Softly","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Brad%20Pitt/_3by4/_derived_jpg_q90_584x800_m0/93887128.jpg"},'+
    '{"creditid":6778326,"fullname":"Leonardo DiCaprio","partname":"Calvin Candie","zodiacsign":"Scorpio","longtitle":"Django sin cadenas","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Leonardo%20DiCaprio/_3by4/_derived_jpg_q90_584x800_m0/74194383.jpg"},' +
    '{"creditid":6778310,"fullname":"Javier Bardem","partname":"Silva","zodiacsign":"Pisces","longtitle":"Skyfall","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Javier%20Bardem/_3by4/_derived_jpg_q90_584x800_m0/82178692.jpg"}]}';
    
    var celebrity;
    getCeleberity();
    var creditCounter = 0;
    var originalTitle;
    function startGame(celebJson) {
        
        celebrity = JSON && JSON.parse(celebJson) || $.parseJSON(celebJson);
        
        if (creditCounter >= celebrity.Credits.length)
            creditCounter = 0;

        var credit = celebrity.Credits[creditCounter];
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
                    //for (var k = 0; k < clickedInputs; k++) {
                    //    if (clickedInputs[k] === "") {
                    //        clickedInputs[k] = $(targ)[0].id;
                    //        break;
                    //    }
                    //}
                    clickedInputs[clickedInputs.length] = $(targ)[0].id;
                    checkInputs($(targ)[0].value);
                }
            });
        }
        
    }

    var clickedInputs = [];
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
 
    function getCeleberity() {
        //var apiUrl = 'http://localhost:2826/api/values';
        //$.ajax({
        //    url: apiUrl,
        //    dataType: 'jsonp',
        //    crossDomain: true,
        //    error: function (e) {
        //        var celebJson = '{"Credits":{"creditid":6767052,"fullname":"Olivia Wilde","partname":"Sabrina McArdle","zodiacsign":"Pisces","longtitle":"The Change-Up","imageurl":"http://cps-static.rovicorp.com/2/Open/Getty/Olivia%20Wilde/_3by4/_derived_jpg_q90_584x800_m0/93212639.jpg"}}';
        //        startGame(celebJson);
        //        console.log(e.message);
        //    },
        //    success: function (data) {
        //        startGame(data);
        //    }
        //});
        startGame(celebsJson);
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

    $('#nav_button').click(function () {
        setNeighborTiles("#cell1");
        getCeleberity();
        $('#grid').removeClass('clearimage').addClass('blurimage');
    });

    $('#resetBtn').click(function () {
        clickedInputs = [];
        var inputs = $('#answer input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (input.id != "mt_blank") {
                inputs[i].value = "";
                $(input).css("background-color", '#fff');
            }
        }
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
