function getHistory() {
    return document.getElementById("history-value").innerText; // 获取历史记录的值
}

function printHistory(num) {
    document.getElementById("history-value").innerText = num; // 显示历史记录
}

function getOutput() {
    return document.getElementById("output-value").innerText; // 获取输出的值
}

function printOutput(num) {
    if (num === "") {
        document.getElementById("output-value").innerText = num; // 如果输出为空，则显示空
    } else {
        document.getElementById("output-value").innerText = getFormattedNumber(num); // 否则，显示格式化后的数字
    }
}

function getFormattedNumber(num) {
    if (num === "-") {
        return ""; // 如果数字是负号，则返回空
    }
    var n = Number(num);
    return n.toLocaleString("en"); // 格式化数字为本地字符串
}

function reverseNumberFormat(num) {
    return Number(num.replace(/,/g, '')); // 反向格式化数字
}

var operator = document.getElementsByClassName("operator");
for (var i = 0; i < operator.length; i++) {
    operator[i].addEventListener('click', function () {
        if (this.id === "clear") {
            printHistory(""); // 清空历史记录
            printOutput(""); // 清空输出
        } else if (this.id === "backspace") {
            var output = reverseNumberFormat(getOutput()).toString();
            if (output) {//if output has a value
                output = output.substr(0, output.length - 1); // 删除最后一个字符
                printOutput(output); // 显示删除后的结果
            }
        } else {
            var output = getOutput();
            var history = getHistory();
            if (output === "" && history !== "") {
                if (isNaN(history[history.length - 1])) {
                    history = history.substr(0, history.length - 1); // 如果历史记录的最后一个字符不是数字，则删除最后一个字符
                }
            }
            if (output !== "" || history !== "") {
                output = output === "" ? output : reverseNumberFormat(output);
                history = history + output;
                if (this.id == "=") {
                    var result = eval(history); // 计算结果
                    printOutput(result); // 显示结果
                    // printHistory(""); // 清空历史记录
                } else {
                    history = history + this.id; // 将运算符添加到历史记录中
                    printHistory(history); // 显示历史记录
                    printOutput(""); // 清空输出
                }
            }
        }

    });
}
var number = document.getElementsByClassName("number");
for (var i = 0; i < number.length; i++) {
    number[i].addEventListener('click', function () {
        var output = reverseNumberFormat(getOutput());
        if (output != NaN) { //if output is a number
            output = output + this.id; // 将数字添加到输出中
            printOutput(output); // 显示输出
        }
    });
}
var microphone = document.getElementById('microphone');
var recognition;
var inputText = ""; // 存储语音输入的文本
var operations = {
    "加": "+",
    "加上": "+",
    "减": "-",
    "减去": "-",
    "乘": "*",
    "乘以": "*",
    "除": "/",
    "除以": "/",
    "等于": "="
};

microphone.onclick = function () {
    microphone.classList.add("record");
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'zh-CN';
    recognition.start(); // 开始语音识别

    recognition.onresult = function(event){
        var input = event.results[0][0].transcript;
        // 移除标点符号
        input = input.replace(/[。，,。]/g, '');

        // 替换识别的操作符
        for(var p in operations){
            var regex = new RegExp(p, 'g');
            input = input.replace(regex, operations[p]);
        }

        // 将语音输入的文本添加到历史记录中
        inputText += input;
        printHistory(inputText);

        // 如果输入了等于，则进行计算
        if (input.includes("=")) {
            evaluate(inputText);
            inputText = ""; // 清空语音输入的文本
        }

        microphone.classList.remove("record");
    }
}

function evaluate(input) {
    try {
        // 移除等于号
        input = input.replace("=", "");
        var result = eval(input);
        document.getElementById("output-value").innerText = result; // 显示结果
    } catch (e) {
        console.log(e);
        document.getElementById("output-value").innerText = "无法计算";
        printHistory(""); // 清空历史记录
        inputText = ""; // 清空语音输入的文本
        // 一秒后清除无法计算的提示
        setTimeout(function() {
            document.getElementById("output-value").innerText = "";
        }, 1000);
    }
}
