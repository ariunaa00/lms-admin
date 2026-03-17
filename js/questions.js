
const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const examId = params.get("examId");

const questionAddBtn = document.getElementById('add-question-btn')
const questionModal = document.getElementById('question-modal')
const questionModalCloseBtn = document.getElementById('quetion-modal-close-btn')
const answerAddBtn = document.getElementById('add-answer-btn')
const defaultAnswerDiv = document.getElementById('answer-0')
const questionSaveBtn = document.getElementById('question-save-btn')
const questionCancelBtn = document.getElementById('question-cancel-btn')

const questionForm = document.getElementById('question-form')

const questionIdInput = document.getElementById('question-id-input')
const questionIdInputInModal = document.getElementById('question-id-input-modal')

const questionTextInput = document.getElementById('question-text-input');
const imgInput = document.getElementById('question-image-input');
const audioInput = document.getElementById('question-audio-input');
const videoInput = document.getElementById('question-video-input');
const imgLoadPredix = 'https://examination-system-zangia-test.s3.us-east-1.amazonaws.com'

let questionsG = []
let answersG = []

const getQuestions = async (examId) => {
    try {
        if (!examId) {
            return null
        }
        const res = await fetch(`http://44.222.255.219:3000/api/v1/exam/${examId}/questions`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <-- Bearer token here
            }
        })

        const questions = await res.json();
        questionsG = questions
        return questions
    } catch (err) {
        console.log(err);
        return []
    }
}

const mountQuestions = async () => {
    const questions = await getQuestions(examId);
    const container = document.getElementById('questions-table-body');

    container.innerHTML = questions.map((question, i) => {
        return `
            <tr >
                <td>${i + 1}</td>
                <td><div data-id="${question.id}" class="question-table-link-col">${question.questionText}</div></td>
                <td><a href="${imgLoadPredix}/${question.imgUrl}">${question.imgUrl ? 'Зураг харах' : 'Зураг байхгүй'}</a></td>
                <td><a href="${imgLoadPredix}/${question.audioUrl}">${question.audioUrl ? 'Дуу харах' : 'Дуу байхгүй'}</a></td>
                <td><a href="${imgLoadPredix}/${question.videoUrl}">${question.videoUrl ? 'Бичлэг харах' : 'Бичлэг байхгүй'}</a></td>
                <td>${question.examAnswers.length}</td>
            </tr>
        `
    }).join("")
    addListenersToQuestionLink();
}

const openQuestionModal = (addDefaultAnswer) => {
    if (addDefaultAnswer) {
        addDefaultAnswerInput();
    }
    questionModal.classList.remove("hide");
}

const closeQuestionModal = (e, clickedOutside) => {
    if (clickedOutside) {
        if (e.target.classList.contains("modal-overlay"))
            questionModal.classList.add("hide");
    } else questionModal.classList.add("hide");

    questionForm.reset();
    deleteAnswerInputs();
}

const removeAnswer = (id) => {
    const div = document.getElementById(id);
    if (div) {
        div.remove();
        answersG.splice(answersG.findIndex(a => a.id === id), 1)
    }
    answersG.map((a, i) => {
        const id = `answer-${i}`
        a.id = id
        a.div.id = id
        return a;
    })
}
const makeAnswerInput = (id, answerId, inputValue) => {

    const div = document.createElement('div')
    div.className = 'question-answers-list-div'
    div.id = id;

    if (answerId) {
        const label = document.createElement('label')
        label.dataset.id = answerId;
        label.style.display = 'none'
        div.append(label)
    }
    const answerInput = document.createElement('input')
    answerInput.className = 'input input-small answer-input';
    answerInput.type = 'text';
    if (inputValue) {
        answerInput.value = inputValue
    }

    const removeBtn = document.createElement('div')
    removeBtn.className = 'question-remove-btn'
    removeBtn.addEventListener('click', () => removeAnswer(id));

    const iconDelete = document.createElement('img')
    iconDelete.className = 'icon remove-answer-icon'
    iconDelete.src = 'assets/images/delete.png'
    iconDelete.alt = 'delete icon'

    removeBtn.append(iconDelete)

    div.append(answerInput)
    div.append(removeBtn)
    return div;
}

const addAnswer = (answerId, inputValue) => {
    if (answersG.length === 5) {
        alert('5аас дээш хариулт нэмэж болохгүй');
        return;
    }
    const answersContainer = document.getElementById('question-answers-list');
    const div = makeAnswerInput(`answer-${answersG.length}`, answerId, inputValue)
    answersContainer.append(div);

    answersG.push({ id: `answer-${answersG.length}`, div })

    if (answersG.length === 5) {
        answerAddBtn.disabled = true
    }
}


const saveQuestion = async () => {
    const questionForm = document.getElementById('question-form')
    const questionId = document.getElementById('question-id-input-modal') ? document.getElementById('question-id-input-modal').value : null;

    const image = imgInput.files[0];
    const audio = audioInput.files[0];
    const video = videoInput.files[0];

    const answersDivs = document.querySelectorAll('.question-answers-list-div')

    const answers = []
    answersDivs.forEach((div, i) => {
        console.log(div);
        const input = div.querySelector('input')
        const id = div.querySelector('label') ? div.querySelector('label').dataset.id : null;

        const answer = {
            answerText: input.value,
            isCorrect: i === 0,
            order: i + 1
        }
        if (id) {
            answer.id = parseInt(id);
        }
        answers.push(answer);
    })


    const formData = new FormData();
    const question = { questionText: questionTextInput.value }
    if (questionId) {
        question.id = questionId
    }

    formData.append('question', JSON.stringify(question));
    formData.append('answers', JSON.stringify(answers));

    if (image) {
        formData.append('image', image)
    }

    if (audio) {
        formData.append('audio', audio)
    }

    if (video) {
        formData.append('video', video)
    }
    await fetch(`http://44.222.255.219:3000/api/v1/exam/${examId}/question`, {
        method: 'POST',
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            closeQuestionModal();
            mountQuestions();
            // imgPreview.style.display = 'none';
            questionForm.reset()
        })
        .catch(error => {
            closeQuestionModal();
            alert("Алдаа гарлаа")
            console.error('Error:', error);
        });

}

const deleteAnswerInputs = () => {
    document.querySelectorAll('.question-answers-list-div').forEach((d) => {
        d.remove();
    })
    answersG = []
    answerAddBtn.disabled = false

}

const addDefaultAnswerInput = () => {
    const div = document.createElement('div')
    div.className = "question-answers-list-div"
    div.id = "answer-0"

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'input input-small answer-input'

    div.append(input);

    const container = document.getElementById('question-answers-list')
    container.append(div)

    answersG = [{ id: 'answer-0', div: defaultAnswerDiv }]

}
const prepareForm = (e) => {
    const id = e.currentTarget.dataset.id;
    const question = questionsG.find(q => q.id === parseInt(id))
    questionTextInput.value = question.questionText
    questionIdInputInModal.value = question.id

    question.examAnswers.forEach(answer => {
        addAnswer(answer.id, answer.answerText);
    })

    openQuestionModal(!question.examAnswers.length > 0);
}

const addListenersToQuestionLink = () => {
    const questionLinks = document.querySelectorAll('.question-table-link-col')
    questionLinks.forEach((link) => {
        link.addEventListener('click', prepareForm)
    })
}

questionAddBtn.addEventListener('click', () => openQuestionModal(true))
questionModalCloseBtn.addEventListener('click', closeQuestionModal)
answerAddBtn.addEventListener('click', () => addAnswer());
questionSaveBtn.addEventListener('click', saveQuestion)
questionCancelBtn.addEventListener('click', closeQuestionModal)
document.addEventListener("DOMContentLoaded", mountQuestions);
