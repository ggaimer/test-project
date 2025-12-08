// ----------------------------
// 1. Настрой Firebase
// ----------------------------
const firebaseConfig = {
    apiKey: "ТВОЙ_KEY",
    authDomain: "ТВОЙ_DOMAIN",
    databaseURL: "ТВОЙ_DATABASE_URL",
    projectId: "ТВОЙ_PROJECT_ID",
    storageBucket: "ТВОЙ_BUCKET",
    messagingSenderId: "ТВОЙ_MSG_ID",
    appId: "ТВОЙ_APP_ID"
}

firebase.initializeApp(firebaseConfig)
const db = firebase.database()


// ----------------------------
// 2. Чтение товаров в реальном времени
// ----------------------------
let allProducts = {} // полный список из базы

db.ref("products").on("value", snap => {
    allProducts = snap.val() || {}
    renderProducts(allProducts)
})


// ----------------------------
// 3. Рендер списка товаров
// ----------------------------
function renderProducts(products) {
    const container = document.getElementById("products")
    container.innerHTML = ""

    Object.entries(products).forEach(([id, product]) => {
        container.innerHTML += `
      <div class="item">
        <h3>${product.name}</h3>
        <p>Цена: ${product.price} USD</p>

        <input 
          id="sold-${id}" 
          placeholder="Продано за..." 
          type="number"
          value="${product.soldPrice ?? ""}"
        >

        <button onclick="savePrice('${id}')">Сохранить</button>
      </div>
    `
    })
}


// ----------------------------
// 4. Сохранить цену продажи
// ----------------------------
function savePrice(id) {
    const soldInput = document.getElementById(`sold-${id}`)
    const value = soldInput.value.trim()

    db.ref("products/" + id).update({
        soldPrice: value || null
    })
}


// ----------------------------
// 5. Поиск товара
// ----------------------------

document.getElementById("search").addEventListener("input", function () {
    const query = this.value.toLowerCase()

    const filtered = Object.fromEntries(
        Object.entries(allProducts).filter(([_, product]) =>
            product.name.toLowerCase().includes(query)
        )
    )

    renderProducts(filtered)
})