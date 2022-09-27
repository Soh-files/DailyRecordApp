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
            }
            reader.readAsText(xhr.response);
        };
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
    });
}()); 