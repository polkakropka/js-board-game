/*____________________________________________________________________________________________________________________

        Quiz
______________________________________________________________________________________________________________________*/

var Question = function (question, answers, correct) {
        this.question = question;
        this.answers = answers;
        this.correct = correct;

    this.displayQuestion = function() {
        $('.question').text(this.question);

        for (var i = 0; i < this.answers.length; i++) {
           $('form').append('<input type="radio" id="answer" name="ans" value="' + i + '">' + this.answers[i]+'<br>');
        }
    }

    this.checkAnswer = function(n) {
        $('input[type="radio"]').change(function(){
        let checked = $(this).is(':checked');
        if(checked) {
            let thisChecked = $(this).val();
            let playerChoice = parseInt(thisChecked);
                if (playerChoice == questions[n].correct) {
                    $('.result').text('This is the right answer, you earn 20 points!');
                    scores += extra.value;
                    $('form').empty();
                    $('.question').empty();

                } else {
                    $('.result').text('Wrong answer... You loose 10 points!');
                    scores -= 10;
                    $('form').empty();
                    $('.question').empty();

                }
            }   
        }); 
    }
}
    var q1 = new Question('What is a capital of Vanezuela',
                          ['Bogota', 'Caracas', 'Buenos Ires'],
                          1);
    var q2 = new Question("Real name Alecia Moore, which colourful US diva sold out three London O2 dates in May 2009?",
                          ['Madonna', 'Katty Perry', 'Pink'],
                          2);
    var q3 = new Question("What Munich festival, claimed to be world's largest Volksfest (People's Fair), attracts over six million visitors each year? ",
                          ['Decemberfest', 'Fashing', 'Oktoberfest'],
                          2);
    var q4 = new Question('The Gaudi designed Sagrada Familia church, whose construction began in 1882 and is unlikely to finish before 2026, is in which European city? ',
                          ['Barcelona', 'Madrid', 'Paris'],
                          0);
    var q5 = new Question("The lahara, used in the liqueur Curacao, is an adaptation of which common fruit?",
                          ['Orange', 'Pasion Fruit', 'Lemon'],
                          0);
    var q6 = new Question('What is the state capital of Victoria, Australia?',
                          ['Melbourne', 'Sydney', 'Moscow'],
                          0);
    var q7 = new Question('In which country is the city of Mecca?',
                          ['Russia', 'Saudi Arabia', 'Oman'],
                          1);

    var questions = [q1, q2, q3, q4, q5, q6, q7];


function initQuiz(){
    scores = 0;
    $('.container-quiz').show();
    var n = random(questions.length);
    questions[n].displayQuestion();
    questions[n].checkAnswer(n);
} 
function closeQuiz(){
    addExtraPoints();
    $('.container-quiz').hide();
    $('form').empty();
    $('.result').empty();
}

