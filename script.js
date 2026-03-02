const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    try {
        // Reset UI
        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        borderingCountries.classList.add('hidden');
        borderingCountries.innerHTML = '';

        // Show spinner
        loadingSpinner.classList.remove('hidden');

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        const country = data[0];

        // Display main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        countryInfo.classList.remove('hidden');

        // Fetch bordering countries
        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountries.innerHTML += `
                    <div>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="80">
                    </div>
                `;
            }

            borderingCountries.classList.remove('hidden');
        } else {
            borderingCountries.innerHTML = `<p>No bordering countries.</p>`;
            borderingCountries.classList.remove('hidden');
        }

    } catch (error) {
        errorMessage.textContent = 'Error: Unable to fetch country data. Please try again.';
        errorMessage.classList.remove('hidden');
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// Button click
searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (country) {
        searchCountry(country);
    }
});

countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = countryInput.value.trim();
        if (country) {
            searchCountry(country);
        }
    }
});