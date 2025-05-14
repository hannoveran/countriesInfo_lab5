function getCountryData() {
  const input = document.getElementById("country").value.trim();

  if (!input) {
    document.getElementById("result").innerHTML = "<p>Будь ласка, введіть назву або код країни.</p>";
    return;
  }

  const isCode = /^[A-Za-z]{2,3}$/.test(input); // якщо введено 2–3 літери – це код
  const endpoint = isCode
    ? `https://restcountries.com/v3.1/alpha/${input}`
    : `https://restcountries.com/v3.1/name/${input}`;

  fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error("Країну не знайдено");
      }
      return response.json();
    })
    .then(data => {
      // завжди масив
      const results = Array.isArray(data) ? data : [data];

      const html = results.map(country => {
        const languages = country.languages
          ? Object.values(country.languages).join(", ")
          : "Невідомо";

        const currencies = country.currencies
          ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(", ")
          : "Невідомо";

        return `
          <div class="card">
            <h2>${country.name.common} (${country.name.official})</h2>
            <img src="${country.flags.svg}" alt="Прапор" width="120">
            <p><strong>Столиця:</strong> ${country.capital ? country.capital[0] : "Немає"}</p>
            <p><strong>Населення:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Континент:</strong> ${country.continents}</p>
            <p><strong>Площа:</strong> ${country.area.toLocaleString()} км²</p>
            <p><strong>Мови:</strong> ${languages}</p>
            <p><strong>Валюта:</strong> ${currencies}</p>
            <p><strong>Часовий пояс:</strong> ${country.timezones.join(", ")}</p>
            <p><strong>Google Maps:</strong> <a href="${country.maps.googleMaps}" target="_blank">Перейти</a></p>
          </div>
        `;
      }).join("");

      document.getElementById("result").innerHTML = html;
    })
    .catch(error => {
      document.getElementById("result").innerHTML = "<p>Країну не знайдено.</p>";
      console.error("Помилка:", error);
    });
}


