function Comparar(){
    var num1 = Number(document.getElementById('num1').value)
    var num2 = Number(document.getElementById('num2').value)
    var num3 = Number(document.getElementById('num3').value)
    var  resultado = document.getElementById('resultado')
    var array = [num1,num2,num3]
    var max = Math.max(...array)
    resultado.innerHTML = `<p class="resultado">${max}</p>`
}

function Ordenar(){

    var num4 = Number(document.getElementById('num4').value)
    var num5 = Number(document.getElementById('num5').value)
    var num6 = Number(document.getElementById('num6').value)
    var  resultado = document.getElementById('resultado2')
    var array = [num4,num5,num6]
    array.sort()
    resultado.innerHTML = `<p class="resultado">${array[0]}, ${array[1]}, ${array[2]}</p>`

}

function ehPalindromo(){

    var string = document.getElementById('string').value
    var resultado = document.getElementById('resultado3')
    var reverse = string.split('').reverse().join('');
    if(string === reverse){
        resultado.innerHTML = '<p class="resultado">É palíndromo</p>'
    }
    else{
        resultado.innerHTML = '<p class="resultado">Não é palíndromo</p>'
    }

}

function verificarTriangulo() {
    var lado1 = Number(document.getElementById('lado1').value);
    var lado2 = Number(document.getElementById('lado2').value);
    var lado3 = Number(document.getElementById('lado3').value);
    var resultado = document.getElementById('resultado4');

    // Verificar se os três lados formam um triângulo
    if (lado1 + lado2 > lado3 && lado1 + lado3 > lado2 && lado2 + lado3 > lado1) {
        // Verificar o tipo de triângulo
        if (lado1 === lado2 && lado2 === lado3) {
            resultado.innerHTML = '<p class="resultado">Triângulo Equilátero</p>';
        } else if (lado1 === lado2 || lado1 === lado3 || lado2 === lado3) {
            resultado.innerHTML = '<p class="resultado">Triângulo Isósceles</p>';
        } else {
            resultado.innerHTML = '<p class="resultado">Triângulo Escaleno</p>';
        }
    } else {
        resultado.innerHTML = '<p class="resultado">Os valores não formam um triângulo</p>';
    }
}
