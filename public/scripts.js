//Variavel para pegar que pagina está atualmente
const currentPage = location.pathname
const menuItens = document.querySelectorAll("header .links a")

for (item of menuItens) {
    if(currentPage.includes(item.getAttribute("href"))) { //Se o nome for igual adiciona a classe active
        item.classList.add("active")
    }
}