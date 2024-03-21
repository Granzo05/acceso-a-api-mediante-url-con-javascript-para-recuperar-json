function cargarTabla() {
    // Traemos todos los paises
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            // Buscamos la tabla            
            let tabla = document.getElementById('tabla');
            tabla.innerHTML = '';

            let paises = [];
            // Iteramos cada pais
            data.forEach((pais, index) => {
                // Si el pais tiene nombre se carga, si no tiene es omitido
                if (pais.altSpellings[1]) {
                    // Creamos la fila
                    let tr = document.createElement('tr');

                    let codigo = document.createElement('td');
                    codigo.textContent = index;

                    let nombre = document.createElement('td');
                    nombre.textContent = pais.altSpellings[1];

                    let capital = document.createElement('td');
                    capital.textContent = pais.capital;

                    let region = document.createElement('td');
                    region.textContent = pais.region;

                    let poblacion = document.createElement('td');
                    poblacion.textContent = pais.population;

                    let latitud = document.createElement('td');
                    latitud.textContent = pais.latlng[0];

                    let longitud = document.createElement('td');
                    longitud.textContent = pais.latlng[1];

                    tr.appendChild(codigo);
                    tr.appendChild(nombre);
                    tr.appendChild(capital);
                    tr.appendChild(region);
                    tr.appendChild(poblacion);
                    tr.appendChild(latitud);
                    tr.appendChild(longitud);

                    tabla.appendChild(tr);

                    let paisDB = {
                        codigo: codigo.textContent,
                        nombre: nombre.textContent,
                        capital: capital.textContent,
                        region: region.textContent,
                        poblacion: poblacion.textContent,
                        latitud: latitud.textContent,
                        longitud: longitud.textContent
                    };
                    // Vamos acumulando los países que están con la info completa
                    paises.push(paisDB);
                }
            });
            // Finalmente enviamos el array con los países al server para guardarlos en la db
            fetch('cargar-paises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paises),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Datos guardados');
                })
                .catch(error => {
                });
        })
        .catch(error => {
            console.error('Error al cargar los datos de la API:', error);
        });
}

cargarTabla();
