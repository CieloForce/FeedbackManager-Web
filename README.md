<div>
   <h1>Feedback Management - FrontEnd</h1>
   <h2>Descrição</h2>
   <p>Este projeto foi desenvolvido utilizando Angular para gerenciar feedbacks de usuários. Ele permite o envio, armazenamento e visualização de feedbacks através de uma interface gráfica. Além disso, fornece visualizações de gráficos para análise das métricas dos feedbacks enviados.</p>
   <h2>Funcionalidades</h2>
   <ul>
      <li>Envio de feedbacks categorizados como "Elogio", "Sugestão" ou "Crítica"</li>
      <li>Armazenamento local dos feedbacks enviados</li>
      <li>Análise gráfica dos feedbacks por categorias</li>
      <li>Confirmação de consumo de feedbacks com opções de aceitar ou rejeitar</li>
   </ul>
   <h2>Tecnologias Usadas</h2>
   <ul>
      <li>Angular</li>
      <li>PrimeNG</li>
      <li>ChartJS</li>
      <li>RxJS</li>
   </ul>
   <h2>Estrutura do Projeto</h2>
   <h3><code>HomeComponent</code></h3>
   <p>O componente principal que lida com toda a lógica de envio, armazenamento e visualização dos feedbacks.</p>
   <h4>Métodos</h4>
   <ul>
      <li><code>send(type: string)</code>: Envio de feedbacks</li>
      <li><code>size()</code>: Obter informações de tamanho das filas de feedbacks</li>
      <li><code>consume(type: string)</code>: Consumir uma mensagem de feedback de um tipo específico</li>
      <li><code>confirmConsume(type: string, messageId: string, receiptHandle: string, message: any)</code>: Confirmar o consumo de uma mensagem de feedback</li>
      <li><code>mountPieChart()</code>: Prepara os dados para o gráfico de pizza</li>
      <li><code>mountStackedBarChart()</code>: Prepara os dados para o gráfico de barras empilhadas</li>
   </ul>
   <h4>Variáveis</h4>
   <ul>
      <li><code>loading</code>: Indicador de carregamento</li>
      <li><code>textAreaValue</code>: Valor do campo de texto para o feedback</li>
      <li><code>pieData</code> e <code>pieOptions</code>: Dados e opções para o gráfico de pizza</li>
      <li><code>stackedData</code> e <code>stackedOptions</code>: Dados e opções para o gráfico de barras empilhadas</li>
      <li><code>documentStyle</code>, <code>textColor</code>, <code>textColorSecondary</code>, <code>surfaceBorder</code>: Estilos para componentes</li>
      <li><code>messagesStorage</code> e <code>messages</code>: Armazenamento local e exibição de mensagens</li>
      <li><code>typeCounter</code>: Contador para tipos de mensagens</li>
      <li><code>totalSize</code>, <code>elogioQueue</code>, <code>sugestaoQueue</code>, <code>criticaQueue</code>: Dados das filas de mensagens</li>
      <li><code>animationDuration</code>: Duração da animação dos gráficos</li>
      <li><code>position</code>: Posição dos tooltips</li>
   </ul>
   <h2>Como Rodar o Projeto</h2>
   <ol>
      <li>Instale o Angular CLI <code>npm install -g @angular/cli</code></li>
      <li>Clone o repositório</li>
      <li>Vá até o arquivo services/ApiService e altere o valor da variável <code>baseUrl</code></li>
      <li>Navegue até a pasta do projeto e execute <code>npm install</code></li>
      <li>Inicie o servidor com <code>ng serve</code></li>
      <li>Abra o navegador e acesse <code>http://localhost:4200/</code></li>
   </ol>
   <h2>Dependências</h2>
   <ul>
      <li>Angular CLI: <code>ng add @angular/cli</code></li>
      <li>RxJS: Já incluído no Angular</li>
   </ul>
   <h2>Contribuição</h2>
   <ul>
      <li>Marcelo Santos</li>
      <li>Vinicius Fonseca</li>
      <li>Marcelo Barbosa</li>
   </ul>
   <h2>Licença</h2>
   <p>MIT</p>
</div>