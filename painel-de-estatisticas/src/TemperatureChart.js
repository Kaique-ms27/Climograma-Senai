import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, LineController, PointElement, LineElement } from 'chart.js';
import { format } from 'date-fns';

// Registre os módulos necessários
Chart.register(LinearScale, CategoryScale, Title, Tooltip, LineController, PointElement, LineElement);

// Defina o adaptador de data para 'date-fns'
Chart.defaults.plugins.tooltip.callbacks.title = (context) => {
  return format(new Date(context[0].label), 'dd/MM/yyyy HH:mm');
};

function TemperatureChart() {
  const [temperatureData, setTemperatureData] = useState(null);
  /*TemperatureData é um objeto declarado que começa com o valor nulo;
    setTemperatureData é uma função que atualiza o valor de TemperatureData.
  */ 

    useEffect(() => {
      const apiKey = '538bc5b5c54b0aca08f350c9aeb25456';
      const city = 'Sao%20Paulo';
    
      // Calcule a data atual em segundos desde o Unix Epoch
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    
      // Calcule a data para daqui a 2 dias em segundos desde o Unix Epoch
      const twoDaysInSeconds = 2 * 24 * 60 * 60;
    
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=16&start=${currentTimeInSeconds}&end=${currentTimeInSeconds + twoDaysInSeconds}`;
    
      // Fazer a solicitação à API OpenWeatherMap para previsão dos próximos 2 dias
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (!data || !data.list || !Array.isArray(data.list)) {
            console.error('A resposta da API OpenWeatherMap está em um formato inesperado.');
            return;
          }
    
          // Verificar se os dados de tempo estão no formato Unix
          const validData = data.list.every((item) => {
            return typeof item.dt === 'number';
          });
    
          if (!validData) {
            console.error('Os dados de tempo da API não estão no formato Unix esperado.');
            return;
          }
    
          // Continuar processando os dados
          const temperatureList = data.list.map((item) => item.main.temp);
          const dateList = data.list.map((item) => new Date(item.dt * 1000).toUTCString());
            
    
          setTemperatureData({
            labels: dateList,
            datasets: [
              {
                label: 'Temperatura em São Paulo (°C)',
                data: temperatureList,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
              },
            ],
          });
        })
        .catch((error) => {
          console.error('Erro ao buscar dados da API:', error);
        });
    }, []);

  if (!temperatureData) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Variação de Temperatura em São Paulo</h2>
      <Line
        data={temperatureData}
        options={{
          scales: {
            x: {},
            y: {
              beginAtZero: true, //Define que o eixo Y inicia apartir do 0;
            },
          },
        }}
      />
    </div>
  );
}

export default TemperatureChart;
