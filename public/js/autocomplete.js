const api_key = '9208654235c6df310184f7826c5f3f730cbe5f07'; // Замените на ваш API-ключ

async function autocompleteAddress(query) {
  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Token ${api_key}`
  };
  const data = {
    query: query,
    locations: [
      {
        country_iso_code: 'RU',
        region_iso_code: 'DON',
        city_type_full: 'г',
        city: ['Кировское', 'Енакиево', 'Шахтёрск', 'Ждановка']
      }
    ]
  };

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.suggestions && data.suggestions.length > 0) {
        const addresses = data.suggestions.map(suggestion => suggestion.value);
        return addresses;
      } else {
        return [];
      }
    })
    .catch(error => {
      console.error('Ошибка при получении автодополнения адреса:', error);
      return [];
    });
}

const addressInput = document.getElementById('addressInput');
const suggestionsList = document.getElementById('suggestionsList');

async function updateSuggestions(query) {
  await autocompleteAddress(query)
    .then(suggestedAddresses => {
      suggestionsList.innerHTML = '';

      suggestedAddresses.forEach(address => {
        const listItem = document.createElement('li');
        listItem.textContent = address;
        suggestionsList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Не удалось получить автодополнение адреса:', error);
    });
}

addressInput.addEventListener('input', (event) => {
  const query = event.target.value;
  updateSuggestions(query);
});