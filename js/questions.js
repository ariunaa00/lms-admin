
const token = localStorage.getItem("token");
let examsG = []

const getQuestions = async (examId) => {
    try {
        if (!examId) {
            return null
        }
        const res = await fetch(`http://localhost:3000/api/v1/exam/${examId}/questions`, {
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
    const params = new URLSearchParams(window.location.search);
    const examId = params.get("examId");

    console.log(examId);
    const questions = await getQuestions(examId);
    const container = document.getElementById('questions-table-body');

    container.innerHTML = questions.map((question) => {
        return `
            <tr>
                <td>${question.exam.name}</td>
                <td><a >${question.questionText}</a></td>
                <td>${question.imgUrl || 'a'}</td>
                <td>${question.audioUrl || 'a'}</td>
                <td>${question.videoUrl || 'a'}</td>
                <td>${question.examAnswers.length}</td>
            </tr>
        `
    }).join("")
}


document.addEventListener("DOMContentLoaded", mountQuestions);
