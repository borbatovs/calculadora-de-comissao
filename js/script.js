const minimumValues = {
    global: 1850,
    banking: 5000,
    offshore: 25000
};

const productSelect = document.getElementById('product');
const saleValueInput = document.getElementById('saleValue');
const minValueInfo = document.getElementById('minValueInfo');
const errorMessage = document.getElementById('errorMessage');
const finalValueDisplay = document.getElementById('finalValue');
const exchangeRateDisplay = document.getElementById('exchangeRate');

// Fetch current exchange rate
let exchangeRate = 5.00; // Default value while loading

async function fetchExchangeRate() {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
        const data = await response.json();
        exchangeRate = parseFloat(data.USDBRL.bid);
        const currentDate = new Date().toLocaleDateString('pt-BR');
        exchangeRateDisplay.textContent = `R$ ${formatNumber(exchangeRate)}`;
    } catch (error) {
        console.error('Erro ao buscar cotação:', error);
    }
}

// Fetch exchange rate when page loads
fetchExchangeRate();

        
        function formatNumber(value) {
            return value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            });
        }

        function parseFormattedNumber(value) {
            return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
        }

        function formatCurrency(input) {
            // Remove tudo exceto números e vírgula
            let value = input.replace(/\D/g, '');
            
            // Converte para número com 2 casas decimais
            value = (parseFloat(value) / 100).toFixed(2);
            
            // Formata com pontos e vírgula
            return formatNumber(parseFloat(value));
        }

        function updateMinValueInfo() {
            const selectedProduct = productSelect.value;
            const minValue = minimumValues[selectedProduct];
            minValueInfo.textContent = `Valor mínimo: US$ ${formatNumber(minValue)}`;
        }

        function calculateFinalValue() {
            const saleValue = parseFormattedNumber(saleValueInput.value);
            const selectedProduct = productSelect.value;
            const minValue = minimumValues[selectedProduct];

            if (saleValue < minValue) {
                errorMessage.style.display = 'block';
                finalValueDisplay.textContent = 'R$ 0,00';
                return;
            }

            errorMessage.style.display = 'none';
            const discountedValue = saleValue * 0.1; // 90% discount (keeping 10%)
            const finalValue = discountedValue * exchangeRate;
            finalValueDisplay.textContent = `R$ ${formatNumber(finalValue)}`;
        }

        saleValueInput.addEventListener('input', function(e) {
            let cursorPosition = this.selectionStart;
            let oldLength = this.value.length;
            this.value = formatCurrency(this.value);
            let newLength = this.value.length;
            cursorPosition += newLength - oldLength;
            this.setSelectionRange(cursorPosition, cursorPosition);
            calculateFinalValue();
        });

        productSelect.addEventListener('change', () => {
            updateMinValueInfo();
            calculateFinalValue();
        });

        // Initialize with default values
        updateMinValueInfo();