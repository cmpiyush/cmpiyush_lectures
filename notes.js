import { structure } from './subjects.js';

// Generate theme cards on the landing page
function generateThemes() {
  const themesContainer = document.getElementById("themes");
  if (!themesContainer) return;
  
  themesContainer.innerHTML = "";
  Object.keys(structure).forEach(theme => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.theme = theme;
    card.textContent = theme;
    card.addEventListener("click", () => {
      document.getElementById("themes").style.display = "none";
      const notesLayout = document.getElementById("notes-layout");
      notesLayout.classList.remove("d-none");
      notesLayout.classList.add("d-flex");
      loadSidebar(theme);
    });
    themesContainer.appendChild(card);
  });
}

// Theme selection logic
document.addEventListener('DOMContentLoaded', () => {
  generateThemes();
});

function loadSidebar(theme) {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  // Show sidebar on desktop, hide on mobile initially
  sidebar.classList.remove('d-none');
  sidebar.classList.add('d-md-block');
  if (window.innerWidth < 768) {
    sidebar.classList.add('d-none');
  }
  sidebar.textContent = "";

  const subjects = structure[theme];
  if (!subjects) {
    sidebar.textContent = "No subjects found for this theme";
    return;
  }
  
  for (const subject in subjects) {
    const section = document.createElement("div");
    section.className = "subject-section";
    
    const title = document.createElement("strong");
    title.textContent = " ▼ " + subject;
    title.style.cursor = "pointer";
    title.onclick = () => {
      const topicsContainer = section.querySelector(".topics-container");
      const isCollapsed = topicsContainer.style.display === "none";
      topicsContainer.style.display = isCollapsed ? "block" : "none";
      title.textContent = isCollapsed ? " ▼ " + subject : " ► " + subject;
    };
    section.appendChild(title);

    const topicsContainer = document.createElement("div");
    topicsContainer.className = "topics-container";
    
    subjects[subject].forEach(topic => {
      const link = document.createElement("div");
      link.className = "topic-link";
      link.textContent = topic.replace('.md', '');
      link.onclick = () => loadNote(theme, subject, topic);
      topicsContainer.appendChild(link);
    });
    section.appendChild(topicsContainer);
    sidebar.appendChild(section);
  }
}

let currentTheme = '';
let currentSubject = '';
let currentTopic = '';
let allTopics = [];

function loadNote(theme, subject, topic) {
  const notesHeader = document.getElementById("notes-header");
  const notesContent = document.getElementById("notes-content");
  if (!notesContent || !notesHeader) return;

  // Auto-collapse sidebar on mobile when note is selected
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth < 768) {
    sidebar.classList.add('d-none');
    sidebar.classList.remove('d-md-block');
  }

  // Store current navigation state
  currentTheme = theme;
  currentSubject = subject;
  currentTopic = topic;
  buildTopicsList();

  // Clear header and add navigation
  notesHeader.innerHTML = '';

  const navContainer = document.createElement('div');
  navContainer.className = 'd-flex justify-content-between align-items-center';

  // Toggle button for mobile
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn btn-outline-light btn-sm me-2 d-md-none';
  toggleBtn.innerHTML = '☰';
  toggleBtn.onclick = () => {
  sidebar.classList.toggle('d-none');
  };
  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'btn btn-outline-light btn-sm';
  prevBtn.innerHTML = '← Previous';
  prevBtn.onclick = navigatePrevious;
  // Title
  const titleSpan = document.createElement('span');
  titleSpan.textContent = `${subject} > ${topic.replace('.md', '')}`;
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-outline-light btn-sm';
  nextBtn.innerHTML = 'Next →';
  nextBtn.onclick = navigateNext;
  // left container with toggle and previous button
  const leftContainer = document.createElement('div');
  leftContainer.className = 'd-flex align-items-center';
  leftContainer.appendChild(toggleBtn);
  leftContainer.appendChild(prevBtn);
  navContainer.appendChild(leftContainer);
  navContainer.appendChild(titleSpan);
  navContainer.appendChild(nextBtn);
  notesHeader.appendChild(navContainer);
  
  // Clear and show loading in content
  notesContent.textContent = "";
  const loading = document.createElement("p");
  loading.textContent = `Loading ${topic.replace('.md', '')}...`;
  notesContent.appendChild(loading);
  
  // Fetch note content
  const notePath = `${encodeURIComponent(theme)}/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}`;
  fetch(notePath)
    .then(response => {
      if (!response.ok) throw new Error('Note not found');
      return response.text();
    })
    .then(text => {
    // configure marked options
      marked.setOptions({
        gfm: true,
        breaks: true,
        tables: true,
        smartLists: true
      });
      notesContent.innerHTML = marked.parse(text);
      styleContent(notesContent);
      renderObsidianMath(notesContent);
    })
    .catch(() => {
      notesContent.textContent = "";
      const error = document.createElement("h4");
      error.textContent = "Notes under preparation. Please visit later.";
      error.style.color = "red";
      notesContent.appendChild(error);
    });
}

function styleContent(element) {
  // Style tables with Bootstrap classes and borders
  const tables = element.querySelectorAll('table');
  tables.forEach(table => {
    table.className = 'table table-bordered table-striped';
    table.style.border = '1px solid #000000';
    table.style.marginTop = '20px';
    table.style.marginBottom = '20px';
    
    // Style table headers
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      th.style.border = '1px solid #000000';
      th.style.backgroundColor = '#f8f9fa';
      th.style.fontWeight = 'bold';
      th.style.padding = '8px';
    });
    
    // Style table cells
    const cells = table.querySelectorAll('td');
    cells.forEach(td => {
      td.style.border = '1px solid #000000';
      td.style.padding = '8px';
    });
  });
}

function renderObsidianMath(element) {
  // Handle Obsidian LaTeX blocks: ```latex ... ```
  element.innerHTML = element.innerHTML.replace(/```latex\n([\s\S]*?)\n```/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: true });
    } catch (e) {
      return `<pre><code>${math}</code></pre>`;
    }
  });
  
  // Handle display LaTeX: $$...$$ (process before inline to avoid conflicts)
  element.innerHTML = element.innerHTML.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: true });
    } catch (e) {
      console.error('KaTeX error:', e, 'Math:', math);
      return match;
    }
  });
  
  // Handle inline LaTeX: $...$
  element.innerHTML = element.innerHTML.replace(/\$([^$\n]+)\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false });
    } catch (e) {
      console.error('KaTeX error:', e, 'Math:', math);
      return match;
    }
  });
}

function buildTopicsList() {
  allTopics = [];
  const subjects = structure[currentTheme];
  for (const subject in subjects) {
    subjects[subject].forEach(topic => {
      allTopics.push({ theme: currentTheme, subject, topic });
    });
  }
}

function navigatePrevious() {
  const currentIndex = allTopics.findIndex(t => 
    t.subject === currentSubject && t.topic === currentTopic
  );
  if (currentIndex > 0) {
    const prev = allTopics[currentIndex - 1];
    loadNote(prev.theme, prev.subject, prev.topic);
  }
}

function navigateNext() {
  const currentIndex = allTopics.findIndex(t => 
    t.subject === currentSubject && t.topic === currentTopic
  );
  if (currentIndex < allTopics.length - 1) {
    const next = allTopics[currentIndex + 1];
    loadNote(next.theme, next.subject, next.topic);
  }
}

// Add search functionality
let searchTimeout;

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
});

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  clearTimeout(searchTimeout);
  
  if (query.length < 2) {
    clearSearchResults();
    return;
  }
  
  searchTimeout = setTimeout(() => {
    // Check if we're on themes page or notes page
    const themesVisible = document.getElementById('themes').style.display !== 'none';
    
    if (themesVisible) {
      performGlobalSearch(query);
    } else {
      searchSidebar(query);
    }
  }, 300);
}

function performGlobalSearch(query) {
  const results = [];
  
  for (const theme in structure) {
    if (theme.toLowerCase().includes(query)) {
      results.push({
        type: 'theme',
        title: theme,
        action: () => selectTheme(theme)
      });
    }
    
    for (const subject in structure[theme]) {
      if (subject.toLowerCase().includes(query)) {
        results.push({
          type: 'subject',
          title: `${theme} > ${subject}`,
          action: () => selectSubject(theme, subject)
        });
      }
      
    for (const topic of structure[theme][subject]) {
      const topicName = topic.replace('.md', '');
      if (topicName.toLowerCase().includes(query)) {
        results.push({
          type: 'topic',
          title: `${theme} > ${subject} > ${topicName}`,
          action: () => loadNote(theme, subject, topic)
        });
      }
    }
  }
}
  
  displaySearchResults(results);
}

function displaySearchResults(results) {
  const themesContainer = document.getElementById('themes');
  
  if (results.length === 0) {
    themesContainer.innerHTML = '<div class="text-center p-4">No results found</div>';
    return;
  }
  
  themesContainer.innerHTML = '';
  
  results.forEach(result => {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'card search-result';
    resultDiv.style.cursor = 'pointer';
    
    const typeLabel = document.createElement('small');
    typeLabel.className = 'text-muted';
    typeLabel.textContent = result.type.toUpperCase();
    
    const title = document.createElement('div');
    title.className = 'fw-bold';
    title.textContent = result.title;
    
    resultDiv.appendChild(typeLabel);
    resultDiv.appendChild(title);
    
    resultDiv.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        result.action();
      } catch (error) {
        console.error('Error executing action:', error);
      }
    });

    themesContainer.appendChild(resultDiv);
  });
}

function searchSidebar(query) {
  const sections = document.querySelectorAll('.subject-section');
  sections.forEach(section => {
    const title = section.querySelector('strong').textContent.toLowerCase();
    const topics = section.querySelectorAll('.topic-link');
    let hasMatch = title.includes(query);
    
    topics.forEach(topic => {
      const topicText = topic.textContent.toLowerCase();
      const matches = topicText.includes(query);
      topic.style.display = matches ? 'block' : 'none';
      if (matches) hasMatch = true;
    });
    
    section.style.display = hasMatch ? 'block' : 'none';
  });
}

function selectTheme(theme) {
  document.getElementById("themes").style.display = "none";
  const notesLayout = document.getElementById("notes-layout");
  notesLayout.classList.remove("d-none");
  notesLayout.classList.add("d-flex");
  loadSidebar(theme);
}

function selectSubject(theme, subject) {
  selectTheme(theme);
  setTimeout(() => {
    const sections = document.querySelectorAll('.subject-section');
    sections.forEach(section => {
      const title = section.querySelector('strong');
      if (title && title.textContent.includes(subject)) {
        const topicsContainer = section.querySelector('.topics-container');
        topicsContainer.style.display = 'block';
        title.textContent = ' ▼ ' + subject;
      }
    });
  }, 100);
}

function clearSearchResults() {
  const themesVisible = document.getElementById('themes').style.display !== 'none';
  if (themesVisible) {
    generateThemes();
  } else {
    // Reset sidebar visibility
    const sections = document.querySelectorAll('.subject-section');
    sections.forEach(section => {
      section.style.display = 'block';
      const topics = section.querySelectorAll('.topic-link');
      topics.forEach(topic => topic.style.display = 'block');
    });
  }
}

function showThemes() {
  document.getElementById("themes").style.display = "grid";
  const notesLayout = document.getElementById("notes-layout");
  notesLayout.classList.add("d-none");
  notesLayout.classList.remove("d-flex");
}

// Feedback form
document.getElementById('feedback-btn').onclick = () => {
  const form = document.getElementById('feedback-form');
  document.getElementById('fb-theme').value = currentTheme;
  document.getElementById('fb-subj').value = currentSubject;
  document.getElementById('fb-topic').value = currentTopic;
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

 // Mobile sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('d-none');
    sidebar.classList.toggle('d-md-block');
  });
}

