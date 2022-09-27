(function() {
    // 変数
    var today;
    var firstDay;
    var firstDayNum;
    var yearMonth;
    var hiddenYear;
    var hiddenMonth;
    var nextMonth;
    var lastDate;
    var thisMonthData = [];
    var updateData = [];
    
    document.addEventListener('DOMContentLoaded', () => {
        // 初期処理
        init();

        // クリックイベント
        for (let i = 1; i <= 42; i++) {
            document.getElementById('cell' + i).addEventListener('click', (e) => {
                e.preventDefault();
                let text = document.getElementById('cellText' + i).textContent;
                if(!document.getElementById('cell' + i).classList.contains('notVisible')) {
                    if(text === '') {
                        document.getElementById('cellText' + i).textContent = '〇';
                    } else {
                        document.getElementById('cellText' + i).textContent = '';
                    }
                }
                // データ保存処理
                saveData();
            });
        }
    });

    // 初期処理
    const init = () => {
        // 今月の1日の曜日を取得
        today = new Date();
        firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        firstDayNum = firstDay.getDay();
        yearMonth = document.getElementById('year-month');
        hiddenYear = document.getElementsByName('year')[0].value;
        hiddenMonth = document.getElementsByName('month')[0].value;

        yearMonth.innerText = today.getFullYear() + '年' + (today.getMonth() + 1) + '月';
        hiddenYear = (today.getFullYear()).toString();
        hiddenMonth = today.getMonth().toString();

        // カレンダー作成
        setCalendar();
        // 日付表示処理
        setDate();
        // ファイル読み込み
        readFile();
    };

    // カレンダー作成処理
    const setCalendar = () => {
        // カレンダーの表示
        const tableBody = document.getElementById('table-body');
        let count = 0;
        for (let i = 0; i < 6; i++) {
            const elmTr = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                count++;
                const elmTd = document.createElement('td');
                elmTd.classList.add('cell-container');
                elmTd.id = 'cell' + count;
                const elmP1 = document.createElement('p');
                elmP1.classList.add('cell-item');
                elmP1.classList.add('cell-item1');
                elmP1.id = 'cellDate' + count;
                const elmP2 = document.createElement('p');
                elmP2.classList.add('cell-item');
                elmP2.classList.add('cell-item2');
                elmP2.id = 'cellText' + count;
                elmTd.appendChild(elmP1);
                elmTd.appendChild(elmP2);
                elmTr.appendChild(elmTd);
            }
            tableBody.appendChild(elmTr);
        }
    };

    // 日付表示処理
    const setDate = () => {
        // 現在の日付を取得
        firstDay = new Date(parseInt(hiddenYear), parseInt(hiddenMonth), 1);
        firstDayNum = firstDay.getDay();

        // 月末を取得
        if(hiddenMonth === '12') {
            nextMonth = new Date(parseInt(hiddenYear) + 1, 1, 0);
        } else {
            nextMonth = new Date(parseInt(hiddenYear), parseInt(hiddenMonth) + 1, 0);
        }
        lastDate = nextMonth.getDate();

        // 現在の表示をクリア
        for(let i = 1; i <= 42; i++) {
            document.getElementById('cellDate' + i).innerText = '';
            if(document.getElementById('cell' + i).classList.contains('notVisible')) {
                document.getElementById('cell' + i).classList.remove('notVisible');
            }
        }

        let count = 0;
        for(let i = 1; i <= 42; i++) {
            if (i >= firstDayNum + 1) {
                count++;
                document.getElementById('cellDate' + i).innerText = count;
            }
            if (count > lastDate) {
                document.getElementById('cell' + i).classList.add('notVisible');
            }
        }
    };

    // ファイルの読み込み処理
    const readFile = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'data.txt', true);
        xhr.responseType = 'blob';
        xhr.send();

        xhr.onload = () => {
            const reader = new FileReader();
            reader.onload = () => {
                console.log(reader.result);
                readAndSetData(reader.result);
            }
            reader.readAsText(xhr.response);
        };
    };

    // データ表示処理
    const readAndSetData = (dataStr) => {
        // 表示中のデータをクリア
        for(let i = 1; i <= 42; i++) {
            document.getElementById('cellText' + i).innerText = '';
        }

        // 配列を初期化
        thisMonthData.length = 0;
        updateData.length = 0;

        // 読み込んだテキストを配列に変換
        const allText = dataStr.split(/\r\n|\n/);
        let tmpMonth = parseInt(hiddenMonth) + 1;
        let month;
        if(tmpMonth.toString().length === 1) {
            month = '0' + tmpMonth.toString();
        }
        let yearMonthStr = hiddenYear + month;
        for(let i = 0; i < allText.length; i++) {
            if(allText[i].substring(0, 6) === yearMonthStr) {
                thisMonthData.push(allText[i]);
            } else {
                updateData.push(allText[i]);
            }
        }

        // 今月のデータを表示
        for(let i = 0; i < thisMonthData.length; i++) {
            for(let j = 1; j <= 42; j++) {
                if(parseInt(thisMonthData[i].substring(6, 8)) === parseInt(document.getElementById('cellDate' + j).innerText)) {
                    document.getElementById('cellText' + j).innerText = "〇";
                }
            }
        }
    };

    // データ保存処理
    const saveData = () => {
        // 今月データの配列を初期化
        thisMonthData.length = 0;
        
        // 表示中のデータから配列を作成
        for(let i = 1; i <= 42; i++) {
            let tmpStr
            let tmpMonth = hiddenMonth + 1;
            let tmpDate = document.getElementById('cellDate' + i).innerText;
            if(document.getElementById('cellText' + i).innerText === '〇') {
                if((parseInt(hiddenMonth) + 1).toString().length === 1) {
                    tmpMonth = '0' + (parseInt(hiddenMonth) + 1).toString();
                }
                if(tmpDate.length === 1) {
                    tmpDate = '0' + tmpDate;
                }
                tmpStr = hiddenYear + tmpMonth + tmpDate;
                thisMonthData.push(tmpStr);
            }
        }

        // テキストファイルに保存する文字列の作成
        let saveText;
        for(let i = 0; i < updateData.length; i++) {
            if(i === 0) {
                saveText = updateData[i];
            } else {
                saveText += '\n' + updateData[i];
            }
        }
        for(let i = 0; i < thisMonthData.length; i++) {
            if(i === 0) {
                saveText += thisMonthData[i];
            } else {
                saveText += '\n' + thisMonthData[i];
            }
        }
        console.log(saveText);
    };

    // 前月ボタンクリック時の処理
    const btnPrev = document.getElementById('btnPrev');
    btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if(hiddenMonth === '0') {
            hiddenYear = (parseInt(hiddenYear) - 1).toString();
            hiddenMonth = '11';
        } else {
            hiddenMonth = (parseInt(hiddenMonth) - 1).toString();
        }
        yearMonth.innerText = hiddenYear + '年' + (parseInt(hiddenMonth) + 1) + '月';
        
        // 日付再表示
        setDate();
        // データ表示処理
        readFile();
    });

    // 次月ボタンクリック時の処理
    const btnNext = document.getElementById('btnNext');
    btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        if(hiddenMonth === '11') {
            hiddenYear = (parseInt(hiddenYear) + 1).toString();
            hiddenMonth = '0';
        } else {
            hiddenMonth = (parseInt(hiddenMonth) + 1).toString();
        }
        yearMonth.innerText = hiddenYear + '年' + (parseInt(hiddenMonth) + 1) + '月';

        // 日付再表示
        setDate();
        // データ表示処理
        readFile();
    });
}()); 