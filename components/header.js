class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `

<header class="home-header">
    <a>Title</a>
    <div class="header-user-section">
        <span id="username"></span>
        <button class="btn btn-primary logout-btn " id="logout-btn">
            Гарах
        </button>
    </div>
</header>

 <div class="modal-overlay hide">
        <div class="modal-wrapper">
            <div class="close-btn-wrapper">
            </div>
            <p class="modal-body">Та гарахдаа итгэлтэй байна уу?</p>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="logout-cancel">Болих</button>
                <button class="btn btn-primary" id="logout-confirm">Гарах</button>
            </div>
        </div>
  </div>
`;
  }
}
customElements.define("app-header", AppHeader);
