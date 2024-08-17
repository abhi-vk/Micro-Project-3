document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.btn');
    let currentInput = '';
    let isResultDisplayed = false;

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (button.id === 'del') {
                if (isResultDisplayed) {
                    // Allow deletion from the result
                    isResultDisplayed = false;
                    currentInput = currentInput.slice(0, -1);
                    display.textContent = currentInput || '0';
                } else {
                    currentInput = currentInput.slice(0, -1);
                    display.textContent = currentInput || '0';
                }
            } else if (button.id === 'reset') {
                currentInput = '';
                display.textContent = '0';
                isResultDisplayed = false;
            } else if (button.id === 'equal') {
                try {
                    const result = calculate(currentInput);
                    display.textContent = result;
                    currentInput = result.toString(); // Store result as a string for further operations
                    isResultDisplayed = true;
                } catch {
                    display.textContent = 'Error';
                }
            } else {
                if (isResultDisplayed) {
                    // Start new input after result is displayed
                    currentInput = '';
                    isResultDisplayed = false;
                }
                currentInput += button.dataset.number || button.dataset.operator;
                display.textContent = currentInput;
            }
        });
    });

    function calculate(expression) {
        // Replace 'x' with '*' for multiplication
        expression = expression.replace(/x/g, '*');

        // Split the expression into numbers and operators
        const tokens = expression.split(/([+\-*/])/);
        let stack = [];

        // Handle multiplication and division first
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i].trim();
            if (token === '*' || token === '/') {
                const left = parseFloat(stack.pop());
                const right = parseFloat(tokens[++i]);
                let result;
                if (token === '*') {
                    result = left * right;
                } else if (token === '/') {
                    result = left / right;
                }
                stack.push(result);
            } else {
                stack.push(token);
            }
        }

        // Handle addition and subtraction
        let result = parseFloat(stack[0]);
        for (let i = 1; i < stack.length; i += 2) {
            const operator = stack[i];
            const right = parseFloat(stack[i + 1]);
            if (operator === '+') {
                result += right;
            } else if (operator === '-') {
                result -= right;
            }
        }

        // Format the result to 3 decimal places if necessary
        if (result % 1 !== 0) {
            result = result.toFixed(3);
        }

        return result;
    }
});
