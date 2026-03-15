
const token = localStorage.getItem("token");

const getExams = async () => {
    try {
        const res = await fetch(`http://localhost:3000/api/v1/exam/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <-- Bearer token here
            }
        })

        const lessons = await res.json();
        lessonsG = lessons
        return lessons
    } catch (err) {
        console.log(err);
        return []
    }
}

const mountExams = async () => {
    const lessons = await getExams();
    const container = document.getElementById('exam-wrapper');

    container.innerHTML = lessons.map((lesson) => {
        return `<div class="card lesson-card" data-id="${lesson.id}">
                <image src="${imgLoadPredix}${lesson.imgUrl}" />
                <span>${lesson.name}</span>
                <a href="exams.html?lessonId=${lesson.id}"> Шалгалтын жагсаалт харах</a>
          </div>`
    }).join("")

    addListenersToCards();
}


document.addEventListener("DOMContentLoaded", mountExams);
