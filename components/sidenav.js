class AppSideNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
<div id="sidenav" class="sidenav">
    <div class="nav-menu-div">
        <image class="icon" alt="lesson" src="assets/images/online-lesson.png"><a href="index.html">Хичээлүүд</a>
    </div>
    <div class="nav-menu-div">
        <image class="icon" alt="exam" src="assets/images/exam.png"><a href="exams.html">Шалгалтууд</a>
    </div>
    <div class="nav-menu-div">
        <image class="icon" alt="users" src="assets/images/friends.png"><a href="examResult.html">Шалгалтын дүн</a>
    </div>
</div>
`;
    }
}
customElements.define("app-sidenav", AppSideNav);
