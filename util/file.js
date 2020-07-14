const myFile = {
    importFile : (file, callBack) => {
        var fileReader = new FileReader();
            fileReader.onload = function(ev) {
                try {
                    var data = ev.target.result,
                        workbook = XLSX.read(data, {
                            type: 'binary'
                        }), // 以二进制流方式读取得到整份excel表格对象
                        data = []; // 存储获取到的数据
                } catch (e) {
                    console.log('文件类型不正确');
                    return;
                }
                const sheet = workbook.Sheets['sheet1'] ? workbook.Sheets['sheet1'] : workbook.Sheets['Sheet1'];
                callBack(myFile.fileTackle(sheet));
            };
            // 以二进制方式打开文件
            fileReader.readAsBinaryString(file);
    },

    exportFile : (data, fileName) =>{
        const sheet = XLSX.utils.aoa_to_sheet(data);
        myFile.openDownloadDialog(myFile.sheet2blob(sheet), fileName + '.xlsx');
    }, 

    sheet2blob : (sheet, sheetName) => {
        sheetName = sheetName || 'sheet1';
        const workbook = {
            SheetNames: [sheetName],
            Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet;
        // 生成excel的配置项
        const wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        const wbout = XLSX.write(workbook, wopts);
        const blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
        // 字符串转ArrayBuffer
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        return blob;
    },

    openDownloadDialog : (url, saveName) => {
	    if(typeof url == 'object' && url instanceof Blob) {
	    	url = URL.createObjectURL(url); // 创建blob地址
	    }
	    const aLink = document.createElement('a');
	    aLink.href = url;
	    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
	    document.body.appendChild(aLink);
        aLink.click();
        aLink.remove();
    },

    fileTackle: (sheet)=> {
        const rowEnd = sheet['!ref'][4];
        const colEnd = sheet['!ref'][3];
        const data = [];
        let temp;
        for(let i = 1; i <= rowEnd; i++) {
            temp = [];
            for(let j = 65; j <= colEnd.charCodeAt(); j++) {
                temp.push(sheet[String.fromCharCode(j) + i].v)
            }
            data.push(temp);
        }
        return data;
    }
}