// catalogo-script.js
// =====================================
// Este script controla a busca, filtros, alternância de visualização
// (grade/lista), paginação e carregamento dinâmico dos cards de resenhas
// ================================================================

// -------- 1. MOCK DE DADOS (substituir por API / JSON real) ------
const reviewsData = [
  {
    id: 1,
    title: "Kiriku e a Feiticeira",
    director: "Michel Ocelot",
    year: 1998,
    genre: "animacao",
    rating: 5,
    cover: "../src/images/kiriku.png",
    excerpt: "Uma obra-prima da animação que combina tradições africanas com técnicas cinematográficas inovadoras. Michel Ocelot criou um universo visual único que transcende barreiras culturais e etárias...",
    type: "filme",
    page: "resenha-kiriku.html"
  },
  {
    id: 2,
    title: "Tempos Modernos",
    director: "Charlie Chaplin",
    year: 1936,
    genre: "comedia",
    rating: 5,
    cover: "../src/images/tempos-modernos-charlie-chaplin.jpg",
    excerpt: "Chaplin antecipou questões sociais que permanecem relevantes hoje. Uma análise profunda sobre como a industrialização afeta a humanidade e a dignidade do trabalho...",
    type: "filme",
    page: "resenha-tempos-modernos.html"
  },
  {
    id: 3,
    title: "Abolição pra quem? Quatro vozes que ainda gritam em 2025",
    director: "César, Djonga, Sabotage, MC Luana",
    year: 2025,
    genre: "musica",
    rating: 5,
    cover: "../src/images/musicas-abolicao.jpg",
    excerpt: "Quatro artistas do rap nacional que transformam dor em resistência, mostrando que a abolição de 1888 foi apenas o começo de uma luta que ainda ecoa nas ruas, favelas e periferias do Brasil...",
    type: "musica",
    page: "resenha-abolicao.html"
  },
  {
    id: 4,
    title: "Exposição Beleza Valente no IMS",
    director: "Zanele Muholi",
    year: 2025,
    genre: "cultura",
    rating: 5,
    cover: "../src/images/beleza-valente-ims.jpg",
    excerpt: "Uma exposição enriquecedora que conecta a história brasileira e sul-africana através da lente de Zanele Muholi, revelando lutas, resistência e a beleza da diversidade humana...",
    type: "cultura",
    page: "resenha-ims.html"
  },
  // ... adicionar todas as resenhas aqui ou carregar via fetch()
];

// -------- 2. VARIÁVEIS GLOBAIS -----------------------------
const PER_PAGE = 12;
let currentPage = 1;
let filteredData = [...reviewsData];

// -------- 3. ELEMENTOS DOM -----------------------------
const reviewsGrid = document.getElementById("reviewsGrid");
const resultCount = document.getElementById("resultCount");
const pageNumbers = document.getElementById("pageNumbers");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const genreFilter = document.getElementById("genreFilter");
const yearFilter = document.getElementById("yearFilter");
const ratingFilter = document.getElementById("ratingFilter");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearFilters = document.getElementById("clearFilters");
const gridViewBtn = document.getElementById("gridView");
const listViewBtn = document.getElementById("listView");

// -------- 4. FUNÇÕES UTILITÁRIAS -------------------------
// Função para obter o nome do gênero formatado
function getGenreName(genre) {
  const genreNames = {
    'animacao': 'Animação',
    'drama': 'Drama',
    'comedia': 'Comédia',
    'acao': 'Ação',
    'suspense': 'Suspense',
    'documentario': 'Documentário',
    'romance': 'Romance',
    'ficcao-cientifica': 'Ficção Científica',
    'musica': 'Música',
    'cultura': 'Cultura'
  };
  return genreNames[genre] || genre;
}

// Função para renderizar os cards
function renderCards() {
  // Limpar grade
  reviewsGrid.innerHTML = "";

  // Verificar se há dados
  if (filteredData.length === 0) {
    reviewsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;">
        <h3>Nenhuma resenha encontrada</h3>
        <p>Tente ajustar os filtros para encontrar o que procura</p>
        <button onclick="clearAllFilters()" class="clear-btn">Limpar Filtros</button>
      </div>
    `;
    updateResultCount(0);
    renderPagination();
    return;
  }

  // Calcular slice da página atual
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const pageData = filteredData.slice(start, end);

  // Criar cards
  pageData.forEach((review) => {
    const card = document.createElement("div");
    card.className = "catalog-review-card";
    card.innerHTML = `
      <div class="catalog-review-image">
          <img src="${review.cover}" alt="${review.title}" loading="lazy">
          <span class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(5-review.rating)}</span>
          <span class="review-genre">${getGenreName(review.genre)}</span>
      </div>
      <div class="catalog-review-content">
          <h3>${review.title}</h3>
          <div class="review-meta">
            <span class="review-director">${review.director}</span>
            <span class="review-year">${review.year}</span>
          </div>
          <p>${review.excerpt}</p>
          <button class="read-full-review" onclick="openReview('${review.page}')">
            ${review.type === 'filme' ? 'Ler Resenha' : 'Ler Artigo'}
          </button>
      </div>`;

    reviewsGrid.appendChild(card);
  });

  // Atualizar contagem
  updateResultCount(pageData.length);

  // Render paginacao
  renderPagination();

  // Scroll suave para o topo da grade
  reviewsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Função para atualizar contador de resultados
function updateResultCount(displayedCount) {
  const totalCount = filteredData.length;
  const start = filteredData.length > 0 ? (currentPage - 1) * PER_PAGE + 1 : 0;
  const end = Math.min(currentPage * PER_PAGE, totalCount);
  
  if (totalCount === 0) {
    resultCount.textContent = "Nenhuma resenha encontrada";
  } else {
    resultCount.textContent = `Exibindo ${start}-${end} de ${totalCount} resenhas`;
  }
}

// Função para renderizar paginação
function renderPagination() {
  pageNumbers.innerHTML = "";
  const totalPages = Math.ceil(filteredData.length / PER_PAGE);

  // Atualizar botões prev/next
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

  // Não mostrar números de página se não houver resultados
  if (totalPages === 0) return;

  // Calcular range de páginas para mostrar
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Ajustar range se estiver no início ou fim
  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  }
  if (currentPage > totalPages - 3) {
    startPage = Math.max(1, totalPages - 4);
  }

  // Criar botões de número de página
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-number" + (i === currentPage ? " active" : "");
    btn.addEventListener("click", () => {
      if (i !== currentPage) {
        currentPage = i;
        renderCards();
      }
    });
    pageNumbers.appendChild(btn);
  }
}

// Função para aplicar filtros
function applyFilters() {
  const genreVal = genreFilter.value;
  const yearVal = yearFilter.value;
  const ratingVal = ratingFilter.value;
  const searchVal = searchInput.value.toLowerCase().trim();

  filteredData = reviewsData.filter((review) => {
    // Filtro de gênero
    const matchesGenre = genreVal ? review.genre === genreVal : true;

    // Filtro de ano
    let matchesYear = true;
    if (yearVal) {
      if (yearVal === "classicos") {
        matchesYear = review.year < 1990;
      } else {
        matchesYear = review.year.toString() === yearVal;
      }
    }

    // Filtro de avaliação
    const matchesRating = ratingVal ? review.rating === parseInt(ratingVal) : true;

    // Filtro de busca
    const matchesSearch = searchVal ? (
      review.title.toLowerCase().includes(searchVal) ||
      review.director.toLowerCase().includes(searchVal) ||
      review.genre.toLowerCase().includes(searchVal) ||
      getGenreName(review.genre).toLowerCase().includes(searchVal)
    ) : true;

    return matchesGenre && matchesYear && matchesRating && matchesSearch;
  });

  currentPage = 1;
  renderCards();
}

// Função para limpar todos os filtros
function clearAllFilters() {
  genreFilter.value = "";
  yearFilter.value = "";
  ratingFilter.value = "";
  searchInput.value = "";
  filteredData = [...reviewsData];
  currentPage = 1;
  renderCards();
}

// Função para alternar visualização
function toggleView(isGrid) {
  if (isGrid) {
    reviewsGrid.classList.remove("list-view");
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
  } else {
    reviewsGrid.classList.add("list-view");
    gridViewBtn.classList.remove("active");
    listViewBtn.classList.add("active");
  }
}

// Função para abrir resenha individual
function openReview(page) {
  if (page === "#") {
    showNotification("Esta resenha estará disponível em breve!");
    return;
  }
  // Redirecionar para página da resenha
  window.location.href = page;
}

// Função para mostrar notificações
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 120px;
    right: 20px;
    background: linear-gradient(45deg, #8b0000, #355c7d);
    color: #f7e2bb;
    padding: 1rem 2rem;
    border-radius: 10px;
    z-index: 1001;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// -------- 5. EVENT LISTENERS -----------------------------

// Inicialização quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Event listeners para busca
  searchBtn.addEventListener("click", applyFilters);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      applyFilters();
    } else {
      // Busca em tempo real com debounce
      clearTimeout(searchInput.debounceTimer);
      searchInput.debounceTimer = setTimeout(applyFilters, 300);
    }
  });

  // Event listeners para filtros
  [genreFilter, yearFilter, ratingFilter].forEach((select) =>
    select.addEventListener("change", applyFilters)
  );

  // Event listener para limpar filtros
  clearFilters.addEventListener("click", clearAllFilters);

  // Event listeners para paginação
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCards();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderCards();
    }
  });

  // Event listeners para visualização
  gridViewBtn.addEventListener("click", () => toggleView(true));
  listViewBtn.addEventListener("click", () => toggleView(false));

  // Renderizar cards iniciais
  renderCards();
});

// -------- 6. ANIMAÇÕES CSS ADICIONAIS -------------------
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .catalog-review-card {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .catalog-review-card:nth-child(2n) {
    animation-delay: 0.1s;
  }
  
  .catalog-review-card:nth-child(3n) {
    animation-delay: 0.2s;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .empty-state {
    color: var(--primary-color, #f7e2bb);
    font-family: 'Libre Baskerville', serif;
  }
  
  .empty-state h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary-color, #f7e2bb);
    font-family: 'DM Sans', sans-serif;
  }
`;
document.head.appendChild(style);
