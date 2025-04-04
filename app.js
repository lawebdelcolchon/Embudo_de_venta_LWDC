// Datos iniciales
const initialMessages = [
  { 
    id: '1', 
    sender: 'Francisco Méndez', 
    content: 'Gracias por la información', 
    timestamp: new Date().toISOString(), 
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
  },
  { 
    id: '2', 
    sender: 'Miguel', 
    content: '¡Hola! Espero que estés bien', 
    timestamp: new Date().toISOString(), 
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg' 
  },
  { 
    id: '3', 
    sender: 'Alejandro Marical', 
    content: 'Solo quería asegurarme...', 
    timestamp: new Date().toISOString(), 
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg' 
  }
];

const initialCategories = [
  { id: '1', name: 'Introducción', color: 'category-blue', messages: [] },
  { id: '2', name: 'Recibir Oferta', color: 'category-purple', messages: [] },
  { id: '3', name: 'Ver Video 1', color: 'category-green', messages: [] },
  { id: '4', name: 'Venta', color: 'category-red', messages: [] }
];

// Estado de la aplicación
let messages = [];
let categories = [];

// Elementos DOM
const messageList = document.getElementById('messageList');
const categoriesContainer = document.getElementById('categoriesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Templates
const messageTemplate = document.getElementById('messageTemplate');
const categoryTemplate = document.getElementById('categoryTemplate');
const categoryCardTemplate = document.getElementById('categoryCardTemplate');

// Inicializar la aplicación
function initApp() {
  // Cargar datos desde localStorage o usar datos iniciales
  loadData();
  
  // Renderizar mensajes y categorías
  renderMessages();
  renderCategories();
  
  // Configurar eventos
  setupEventListeners();
}

// Cargar datos desde localStorage
function loadData() {
  const savedMessages = localStorage.getItem('messages');
  const savedCategories = localStorage.getItem('categories');
  
  if (savedMessages) {
    try {
      messages = JSON.parse(savedMessages);
    } catch (e) {
      console.error('Error parsing saved messages:', e);
      messages = [...initialMessages];
    }
  } else {
    messages = [...initialMessages];
  }
  
  if (savedCategories) {
    try {
      categories = JSON.parse(savedCategories);
    } catch (e) {
      console.error('Error parsing saved categories:', e);
      categories = [...initialCategories];
    }
  } else {
    categories = [...initialCategories];
  }
}

// Guardar datos en localStorage
function saveData() {
  localStorage.setItem('messages', JSON.stringify(messages));
  localStorage.setItem('categories', JSON.stringify(categories));
}

// Renderizar mensajes
function renderMessages() {
  messageList.innerHTML = '';
  
  messages.forEach(message => {
    const messageElement = createMessageElement(message);
    messageList.appendChild(messageElement);
  });
  
  // Scroll al último mensaje
  messageList.scrollTop = messageList.scrollHeight;
}

// Crear elemento de mensaje
function createMessageElement(message) {
  const clone = messageTemplate.content.cloneNode(true);
  const messageElement = clone.querySelector('.message');
  
  messageElement.dataset.id = message.id;
  
  if (message.isOwn) {
    messageElement.classList.add('own');
  }
  
  const avatar = messageElement.querySelector('.avatar');
  avatar.src = message.avatar || 'https://via.placeholder.com/40';
  avatar.alt = message.sender;
  
  messageElement.querySelector('.sender').textContent = message.sender;
  messageElement.querySelector('.timestamp').textContent = formatDate(message.timestamp);
  messageElement.querySelector('.text').textContent = message.content;
  
  // Configurar eventos de arrastrar
  messageElement.addEventListener('dragstart', handleMessageDragStart);
  messageElement.addEventListener('dragend', handleDragEnd);
  
  return messageElement;
}

// Renderizar categorías
function renderCategories() {
  categoriesContainer.innerHTML = '';
  
  categories.forEach(category => {
    const categoryElement = createCategoryElement(category);
    categoriesContainer.appendChild(categoryElement);
  });
}

// Crear elemento de categoría
function createCategoryElement(category) {
  const clone = categoryTemplate.content.cloneNode(true);
  const categoryElement = clone.querySelector('.category-column');
  
  categoryElement.dataset.id = category.id;
  categoryElement.classList.add(category.color);
  
  categoryElement.querySelector('.category-title').textContent = category.name;
  
  const leadCount = categoryElement.querySelector('.lead-count');
  leadCount.textContent = `${category.messages.length} leads`;
  
  const cardsContainer = categoryElement.querySelector('.category-cards');
  
  // Renderizar tarjetas de la categoría
  category.messages.forEach(message => {
    const cardElement = createCategoryCardElement(message, category.id);
    cardsContainer.appendChild(cardElement);
  });
  
  // Configurar eventos de soltar
  categoryElement.addEventListener('dragover', handleDragOver);
  categoryElement.addEventListener('dragleave', handleDragLeave);
  categoryElement.addEventListener('drop', handleDrop);
  
  return categoryElement;
}

// Crear elemento de tarjeta de categoría
function createCategoryCardElement(message, categoryId) {
  const clone = categoryCardTemplate.content.cloneNode(true);
  const cardElement = clone.querySelector('.category-card');
  
  cardElement.dataset.id = message.id;
  cardElement.dataset.categoryId = categoryId;
  
  const avatar = cardElement.querySelector('.avatar');
  avatar.src = message.avatar || 'https://via.placeholder.com/40';
  avatar.alt = message.sender;
  
  cardElement.querySelector('.sender').textContent = message.sender;
  cardElement.querySelector('.timestamp').textContent = formatDate(message.timestamp);
  cardElement.querySelector('.text').textContent = message.content;
  
  // Configurar eventos de arrastrar
  cardElement.addEventListener('dragstart', handleCardDragStart);
  cardElement.addEventListener('dragend', handleDragEnd);
  
  return cardElement;
}

// Configurar eventos
function setupEventListeners() {
  // Enviar mensaje
  sendButton.addEventListener('click', sendMessage);
  
  // Enviar mensaje con Enter
  messageInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// Enviar mensaje
function sendMessage() {
  const content = messageInput.value.trim();
  if (!content) return;
  
  const newMessage = {
    id: Date.now().toString(),
    sender: 'Tú',
    content,
    timestamp: new Date().toISOString(),
    isOwn: true,
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  };
  
  messages.push(newMessage);
  saveData();
  renderMessages();
  
  messageInput.value = '';
  
  // Simular respuesta automática después de 1 segundo
  setTimeout(() => {
    const autoReply = {
      id: (Date.now() + 1).toString(),
      sender: 'Cliente',
      content: '¡Gracias por tu mensaje! Te responderé pronto.',
      timestamp: new Date().toISOString(),
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    };
    
    messages.push(autoReply);
    saveData();
    renderMessages();
  }, 1000);
}

// Manejar inicio de arrastre de mensaje
function handleMessageDragStart(e) {
  const messageId = e.target.dataset.id;
  e.dataTransfer.setData('application/json', JSON.stringify({
    type: 'message',
    id: messageId
  }));
  e.target.classList.add('dragging');
}

// Manejar inicio de arrastre de tarjeta
function handleCardDragStart(e) {
  const cardElement = e.target;
  const messageId = cardElement.dataset.id;
  const categoryId = cardElement.dataset.categoryId;
  
  e.dataTransfer.setData('application/json', JSON.stringify({
    type: 'card',
    id: messageId,
    categoryId
  }));
  
  cardElement.classList.add('dragging');
}

// Manejar fin de arrastre
function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

// Manejar arrastre sobre categoría
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drop-active');
}

// Manejar salida de arrastre de categoría
function handleDragLeave(e) {
  e.currentTarget.classList.remove('drop-active');
}

// Manejar soltar en categoría
function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drop-active');
  
  const targetCategoryId = e.currentTarget.dataset.id;
  
  try {
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (data.type === 'message') {
      // Mover mensaje del chat a una categoría
      moveMessageToCategory(data.id, targetCategoryId);
    } else if (data.type === 'card') {
      // Mover tarjeta entre categorías
      moveCardBetweenCategories(data.id, data.categoryId, targetCategoryId);
    }
  } catch (error) {
    console.error('Error processing drop:', error);
  }
}

// Mover mensaje a categoría
function moveMessageToCategory(messageId, categoryId) {
  const message = messages.find(m => m.id === messageId);
  if (!message) return;
  
  // Verificar si el mensaje ya está en la categoría
  const category = categories.find(c => c.id === categoryId);
  if (category.messages.some(m => m.id === messageId)) return;
  
  // Añadir mensaje a la categoría
  category.messages.push(message);
  
  saveData();
  renderCategories();
}

// Mover tarjeta entre categorías
function moveCardBetweenCategories(messageId, sourceCategoryId, targetCategoryId) {
  if (sourceCategoryId === targetCategoryId) return;
  
  const sourceCategory = categories.find(c => c.id === sourceCategoryId);
  const targetCategory = categories.find(c => c.id === targetCategoryId);
  
  if (!sourceCategory || !targetCategory) return;
  
  const messageIndex = sourceCategory.messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) return;
  
  // Mover mensaje entre categorías
  const [movedMessage] = sourceCategory.messages.splice(messageIndex, 1);
  targetCategory.messages.push(movedMessage);
  
  saveData();
  renderCategories();
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} d`;
  
  return date.toLocaleDateString();
}

// Simular conexión webhook
function setupWebhookSimulation() {
  // En una aplicación real, aquí conectarías con n8n usando EventSource o WebSocket
  // Esta es una simulación para propósitos de demostración
  console.log('Configurando simulación de webhook...');
  
  setInterval(() => {
    // Simular recepción de mensaje cada 30 segundos
    if (Math.random() > 0.7) { // 30% de probabilidad
      const senders = ['Juan Carlos', 'María López', 'Roberto Gómez', 'Ana Martínez'];
      const contents = [
        '¿Podría obtener más información sobre sus servicios?',
        'Estoy interesado en su producto premium',
        'Gracias por la atención, me gustaría una demostración',
        '¿Cuál es el precio del paquete básico?'
      ];
      
      const randomSender = senders[Math.floor(Math.random() * senders.length)];
      const randomContent = contents[Math.floor(Math.random() * contents.length)];
      const randomAvatar = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`;
      
      const webhookMessage = {
        id: Date.now().toString(),
        sender: randomSender,
        content: randomContent,
        timestamp: new Date().toISOString(),
        avatar: randomAvatar
      };
      
      messages.push(webhookMessage);
      saveData();
      renderMessages();
      
      // Notificar al usuario
      showNotification(`Nuevo mensaje de ${randomSender}`);
    }
  }, 30000);
}

// Mostrar notificación
function showNotification(message) {
  // Verificar si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    alert("Este navegador no soporta notificaciones de escritorio");
  }
  
  // Verificar permiso
  else if (Notification.permission === "granted") {
    const notification = new Notification("Nuevo mensaje", {
      body: message,
      icon: "https://via.placeholder.com/64"
    });
  }
  
  // Solicitar permiso
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        const notification = new Notification("Nuevo mensaje", {
          body: message,
          icon: "https://via.placeholder.com/64"
        });
      }
    });
  }
}

// Función para conectar con webhook real de n8n
function connectToN8nWebhook(webhookUrl) {
  // Esta función se usaría en un entorno de producción
  const eventSource = new EventSource(webhookUrl);
  
  eventSource.onmessage = function(event) {
    try {
      const data = JSON.parse(event.data);
      
      // Convertir los datos recibidos al formato de mensaje
      const newMessage = {
        id: data.id || Date.now().toString(),
        sender: data.sender || 'Usuario',
        content: data.content || 'Mensaje sin contenido',
        timestamp: data.timestamp || new Date().toISOString(),
        avatar: data.avatar || 'https://via.placeholder.com/40'
      };
      
      messages.push(newMessage);
      saveData();
      renderMessages();
      
      // Notificar al usuario
      showNotification(`Nuevo mensaje de ${newMessage.sender}`);
    } catch (error) {
      console.error('Error procesando mensaje del webhook:', error);
    }
  };
  
  eventSource.onerror = function() {
    console.error('Error en la conexión con el webhook');
    // Reconectar después de un tiempo
    setTimeout(() => {
      connectToN8nWebhook(webhookUrl);
    }, 5000);
  };
  
  return eventSource;
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  initApp();
  setupWebhookSimulation();
  
  // Para conectar con un webhook real, descomentar la siguiente línea
  // y reemplazar la URL con la de tu webhook de n8n
  // const eventSource = connectToN8nWebhook('https://tu-instancia-n8n.com/webhook/path');
});