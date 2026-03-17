
let resultG = []
const params = new URLSearchParams(window.location.search);
const examId = params.get("examId");
const token = localStorage.getItem("token");


const getResult = async (examId) => {
    try {
        if (!examId) {
            return null
        }
        const res = await fetch(`http://localhost:3000/api/v1/exam/${examId}/result`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <-- Bearer token here
            }
        })

        const results = await res.json();
        resultG = results
        return results
    } catch (err) {
        console.log(err);
        return []
    }
}
const mountResults = async () => {
    
    const results = await getResult(examId);
    const container = document.getElementById('results-table-body');

    container.innerHTML = results.map((result, i) => {
        return `
            <tr >
                <td>${i + 1}</td>
                <td><div data-id="${result.id}" class="result-table-link-col">${result.exam.name}</div></td>
                <td>${result.totalPoint}</td>
                <td>${result.correctPoint}</td>
                <td>${result.answeredQuestionNum}</td>
                <td>${result.totalTime} ${result.exam.durationUnit}</td>
            </tr>
        `
    }).join("")
    // addListenersToQuestionLink();
}





document.addEventListener("DOMContentLoaded", mountResults);
