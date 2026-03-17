const token = localStorage.getItem("token");
const editModal = document.getElementById('lesson-modal')
const addLessonBtn = document.getElementById('add-lesson-btn')
let lessonCards = document.querySelectorAll('.lesson-card')
const lessonForm = document.getElementById('lesson-form')
const lessonSaveCancelBtn = document.getElementById('lesson-save-cancel-btn')
const lessonModalCloseBtn = document.getElementById('lesson-modal-close-btn')

const idInput = document.getElementById('lesson-id');
const imgInput = document.getElementById('lesson-image-input');
const nameInput = document.getElementById('lesson-name-input');
const imgPreview = document.getElementById('lesson-img-preview');

const imgLoadPredix = 'https://examination-system-zangia-test.s3.us-east-1.amazonaws.com'
let lessonsG = []


async function urlToFile(url, filename, mimeType) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
}

const getLessons = async () => {
    try {
        const res = await fetch(`http://44.222.255.219:3000/api/v1/lesson/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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

const saveLesson = async (event) => {
    event.preventDefault();
    const imgInput = document.getElementById('lesson-image-input');
    const name = document.getElementById('lesson-name-input').value;
    const id = document.getElementById('lesson-id') ? document.getElementById('lesson-id').dataset.id : null

    const file = imgInput.files[0];

    if (!file && !id) { //шинээр хичээл нэмэх үед
        alert('Зураг байхгүй байна.')
        return
    }

    const formData = new FormData();
    formData.append('lessonName', name);

    if (id) {
        formData.append('id', id)
    }

    if (file) {
        formData.append('image', file);
    }

    await fetch('http://44.222.255.219:3000/api/v1/lesson', {
        method: 'POST',
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            closeEditModal();
            mountLessons();
            imgPreview.style.display = 'none';
            lessonForm.reset()
        })
        .catch(error => {
            alert("Алдаа гарлаа")
            closeEditModal();
            console.error('Error:', error);
        });

}

const mountLessons = async (_lessons) => {
    const lessons = _lessons || await getLessons();
    const container = document.getElementById('lesson-wrapper');

    container.innerHTML = lessons.map((lesson) => {
        return `<div class="card lesson-card" data-id="${lesson.id}">
                <image src="${imgLoadPredix}${lesson.imgUrl}" />
                <span>${lesson.name}</span>
                <a href="exams.html?lessonId=${lesson.id}"> Шалгалтын жагсаалт харах</a>
          </div>`
    }).join("")

    addListenersToCards();
}

const prepareForm = async (e) => {

    const id = e.currentTarget.dataset.id;
    const lesson = lessonsG.find(lesson => lesson.id === parseInt(id));

    nameInput.value = lesson.name;
    imgPreview.src = `${imgLoadPredix}${lesson.imgUrl}`;
    imgPreview.style.display = 'block';
    idInput.dataset.id = id;

    openEditModal();
}

const openEditModal = () => {
    editModal.classList.remove("hide");
}

const closeEditModal = (e, clickedOutside) => {
    if (clickedOutside) {
        if (e.target.classList.contains("modal-overlay"))
            editModal.classList.add("hide");
    } else editModal.classList.add("hide");
}

const addListenersToCards = () => {
    lessonCards = document.querySelectorAll('.lesson-card')
    lessonCards.forEach(card => {
        card.addEventListener('click', prepareForm)
    })
}

const whenImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB
        alert("Том файл байна.");
        imgInput.value = ""; // clear selection
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        imgPreview.src = event.target.result;
        imgPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => mountLessons());

addLessonBtn.addEventListener('click', openEditModal);
editModal.addEventListener("click", (e) => closeModal(e, true));
imgInput.addEventListener('change', whenImgChange)
lessonForm.addEventListener("submit", saveLesson)
lessonSaveCancelBtn.addEventListener('click', closeEditModal)
lessonModalCloseBtn.addEventListener('click', closeEditModal)