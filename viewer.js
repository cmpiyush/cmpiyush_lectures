let currentSemester = "Concepts", currentSubject = "", currentTopic = "";
let allTopics = [];
let currentTopicIndex = -1;
const navTree = document.getElementById('nav-tree'), noteDisplay = document.getElementById('note-display');

function createTree() {
  navTree.innerHTML = '';
  allTopics = [];
  document.getElementById('current-semester').textContent = currentSemester;
  
  for (let subject in structure[currentSemester]) {
    const subjectDiv = document.createElement('div');
    subjectDiv.className = 'subject-section';
    
    const subjectHeader = document.createElement('div');
    subjectHeader.className = 'subject-header';
    subjectHeader.textContent = subject;
    
    const topicsContainer = document.createElement('div');
    topicsContainer.className = 'topics-container';
    
    subjectHeader.onclick = () => {
      subjectHeader.classList.toggle('collapsed');
      topicsContainer.classList.toggle('hidden');
    };
    
    // Direct iteration over topics (no units)
    structure[currentSemester][subject].forEach(topic => {
      allTopics.push({ subject, topic });
      
      const topicDiv = document.createElement('div');
      topicDiv.className = 'topic-item';
      topicDiv.textContent = topic.replace('.md', '');
      topicDiv.onclick = () => {
        document.querySelectorAll('.active-item').forEach(el => el.classList.remove('active-item'));
        topicDiv.classList.add('active-item');
        currentSubject = subject; currentTopic = topic;
        currentTopicIndex = allTopics.findIndex(t => t.topic === topic && t.subject === subject);
        loadNote(`${currentSemester}/${subject}/${topic}`);
        updateNavigation();
      };
      topicsContainer.appendChild(topicDiv);
    });
    
    subjectDiv.appendChild(subjectHeader);
    subjectDiv.appendChild(topicsContainer);
    navTree.appendChild(subjectDiv);
  }
}

function updateNavigation() {
  const navigation = document.getElementById('navigation');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (navigation && prevBtn && nextBtn && currentTopicIndex >= 0) {
    navigation.style.display = 'flex';
    prevBtn.disabled = currentTopicIndex === 0;
    nextBtn.disabled = currentTopicIndex === allTopics.length - 1;
  }
}

function navigateToTopic(index) {
  if (index >= 0 && index < allTopics.length) {
    const topic = allTopics[index];
    currentTopicIndex = index;
    currentSubject = topic.subject;
    currentTopic = topic.topic;
    loadNote(`${currentSemester}/${topic.subject}/${topic.topic}`);
    updateNavigation();
    
    document.querySelectorAll('.active-item').forEach(el => el.classList.remove('active-item'));
    document.querySelectorAll('.topic-item').forEach(item => {
      if (item.textContent === topic.topic.replace('.md', '')) {
        item.classList.add('active-item');
      }
    });
  }
}

async function loadNote(filePath) {
  try {
    const encodedPath = encodeURI(filePath);
    const res = await fetch(encodedPath);
    if (!res.ok) {
      noteDisplay.innerHTML = `<p style="color:red">File not found: ${filePath}</p>`;
      return;
    }
    const text = await res.text();
    noteDisplay.innerHTML = marked.parse(text);
  } catch (err) {
    noteDisplay.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Semester navigation
  document.querySelectorAll('[data-semester]').forEach((link, i) => {
    link.onclick = e => {
      e.preventDefault();
      currentSemester = link.dataset.semester;
      createTree();
      noteDisplay.innerHTML = '<p>Select a note to view it here.</p>';
      document.getElementById('navigation').style.display = 'none';
      document.querySelectorAll('[data-semester]').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    };
    if (i === 0) link.classList.add('active');
  });
  
  // Navigation buttons
  document.getElementById('prev-btn').onclick = () => navigateToTopic(currentTopicIndex - 1);
  document.getElementById('next-btn').onclick = () => navigateToTopic(currentTopicIndex + 1);
  
  createTree();
});

// Feedback form
document.getElementById('feedback-btn').onclick = () => {
  const form = document.getElementById('feedback-form');
  document.getElementById('fb-sem').value = currentSemester;
  document.getElementById('fb-subj').value = currentSubject;
  document.getElementById('fb-unit').value = currentUnit;
  document.getElementById('fb-topic').value = currentTopic;
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
};
