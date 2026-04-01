window.config = {
    basePath: "/Apriso/Portal/VueProject/InspectionOnline/",
    render: "board1",
};
// 获取当前登录人window.Operator
window.Operator = "gw_wangzm26"
// 获取工位列表
window.getSelectionList = function (callback) {
    // 入参 data
    let obj = [{
        "FacilityName": "K102智联重卡超级工厂", "DataList": [{
            "ProductionLineNo": "K102PL01",
            "ProductionLineDesc": "智联重卡整车总装",
            "Data": [{"WorkStation": "K102PL01A0650", "WorkStationDesc": "气密性检测"}, {
                "WorkStation": "K102PL01A0660",
                "WorkStationDesc": "OBD排放检测"
            }, {"WorkStation": "K102PL01A0670", "WorkStationDesc": "调试静态检测"}, {
                "WorkStation": "K102PL01A0680",
                "WorkStationDesc": "调试返修"
            }, {"WorkStation": "K102PL01A0690", "WorkStationDesc": "总检"}, {
                "WorkStation": "K102PL01A0700",
                "WorkStationDesc": "入库"
            }, {"WorkStation": "K102PL01B0010", "WorkStationDesc": "工序1"}, {
                "WorkStation": "K102PL01B0020",
                "WorkStationDesc": "工序2"
            }, {"WorkStation": "K102PL01A0010", "WorkStationDesc": "车架上线"}, {
                "WorkStation": "K102PL01A0020",
                "WorkStationDesc": "车架预装"
            }, {"WorkStation": "K102PL01A0030", "WorkStationDesc": "V推拧紧"}, {
                "WorkStation": "K102PL01A0040",
                "WorkStationDesc": "底盘线束和管束铺设1"
            }, {
                "WorkStation": "K102PL01A0050",
                "WorkStationDesc": "底盘线束和管束铺设2"
            }, {"WorkStation": "K102PL01A0060", "WorkStationDesc": "动力悬置软垫拧紧"}, {
                "WorkStation": "K102PL01A0070",
                "WorkStationDesc": "气管链接"
            }, {"WorkStation": "K102PL01A0080", "WorkStationDesc": "平衡悬架吊装"}, {
                "WorkStation": "K102PL01A0090",
                "WorkStationDesc": "平衡悬架螺栓拧紧"
            }, {"WorkStation": "K102PL01A0100", "WorkStationDesc": "后U型螺栓拧紧"}, {
                "WorkStation": "K102PL01A0110",
                "WorkStationDesc": "前桥吊装1"
            }, {"WorkStation": "K102PL01A0120", "WorkStationDesc": "前桥吊装2"}, {
                "WorkStation": "K102PL01A0130",
                "WorkStationDesc": "前U型螺栓拧紧"
            }, {"WorkStation": "K102PL01A0140", "WorkStationDesc": "中桥吊装1"}, {
                "WorkStation": "K102PL01A0150",
                "WorkStationDesc": "中桥吊装2"
            }, {"WorkStation": "K102PL01A0160", "WorkStationDesc": "后桥吊装1"}, {
                "WorkStation": "K102PL01A0170",
                "WorkStationDesc": "后桥吊装2"
            }, {"WorkStation": "K102PL01A0180", "WorkStationDesc": "储气筒气管插接"}, {
                "WorkStation": "K102PL01A0190",
                "WorkStationDesc": "桥间传动轴吊装"
            }, {"WorkStation": "K102PL01A0200", "WorkStationDesc": "中传动轴吊装"}, {
                "WorkStation": "K102PL01A0210",
                "WorkStationDesc": "防护梁吊装"
            }, {"WorkStation": "K102PL01A0220", "WorkStationDesc": "车架翻转"}, {
                "WorkStation": "K102PL01A0230",
                "WorkStationDesc": "尿素箱管路连接"
            }, {"WorkStation": "K102PL01A0240", "WorkStationDesc": "驾驶室前悬吊装"}, {
                "WorkStation": "K102PL01A0250",
                "WorkStationDesc": "方向机吊装"
            }, {"WorkStation": "K102PL01A0260", "WorkStationDesc": "水箱吊装"}, {
                "WorkStation": "K102PL01A0270",
                "WorkStationDesc": "发动机落装1"
            }, {"WorkStation": "K102PL01A0280", "WorkStationDesc": "发动机落装2"}, {
                "WorkStation": "K102PL01A0290",
                "WorkStationDesc": "发动机落装3"
            }, {"WorkStation": "K102PL01A0300", "WorkStationDesc": "蓄电池吊装"}, {
                "WorkStation": "K102PL01A0310",
                "WorkStationDesc": "转向管路连接"
            }, {"WorkStation": "K102PL01A0320", "WorkStationDesc": "V推与车桥拧紧"}, {
                "WorkStation": "K102PL01A0330",
                "WorkStationDesc": "驾驶室后悬吊装"
            }, {"WorkStation": "K102PL01A0340", "WorkStationDesc": "空调管路连接"}, {
                "WorkStation": "K102PL01A0350",
                "WorkStationDesc": "SCR箱吊装"
            }, {"WorkStation": "K102PL01A0360", "WorkStationDesc": "挂车板吊装"}, {
                "WorkStation": "K102PL01A0370",
                "WorkStationDesc": "挂车管路连接"
            }, {"WorkStation": "K102PL01A0380", "WorkStationDesc": "水寒宝管路连接"}, {
                "WorkStation": "K102PL01A0390",
                "WorkStationDesc": "进气系统安装"
            }, {"WorkStation": "K102PL01A0400", "WorkStationDesc": "中冷管路连接"}, {
                "WorkStation": "K102PL01A0410",
                "WorkStationDesc": "前后轮挡泥板安装"
            }, {"WorkStation": "K102PL01A0420", "WorkStationDesc": "油液加注1"}, {
                "WorkStation": "K102PL01A0430",
                "WorkStationDesc": "油箱吊装"
            }, {"WorkStation": "K102PL01A0440", "WorkStationDesc": "轮胎安装"}, {
                "WorkStation": "K102PL01A0450",
                "WorkStationDesc": "轮胎拧紧"
            }, {"WorkStation": "K102PL01A0460", "WorkStationDesc": "驾驶室落装1"}, {
                "WorkStation": "K102PL01A0470",
                "WorkStationDesc": "驾驶室落装2"
            }, {
                "WorkStation": "K102PL01A0480",
                "WorkStationDesc": "驾驶室前围管线连接1"
            }, {
                "WorkStation": "K102PL01A0490",
                "WorkStationDesc": "驾驶室前围管线连接2"
            }, {"WorkStation": "K102PL01A0500", "WorkStationDesc": "软轴连接"}, {
                "WorkStation": "K102PL01A0510",
                "WorkStationDesc": "保险杠安装"
            }, {"WorkStation": "K102PL01A0520", "WorkStationDesc": "油液加注2"}, {
                "WorkStation": "K102PL01A0530",
                "WorkStationDesc": "油液加注3"
            }, {"WorkStation": "K102PL01A0540", "WorkStationDesc": "鞍座吊装"}, {
                "WorkStation": "K102PL01A0550",
                "WorkStationDesc": "方向盘安装"
            }, {"WorkStation": "K102PL01A0560", "WorkStationDesc": "车辆下线"}, {
                "WorkStation": "K102PL01A0570",
                "WorkStationDesc": "预调"
            }, {"WorkStation": "K102PL01A0580", "WorkStationDesc": "四轮定位"}, {
                "WorkStation": "K102PL01A0590",
                "WorkStationDesc": "检测线"
            }, {"WorkStation": "K102PL01A0600", "WorkStationDesc": "ADAS标定"}, {
                "WorkStation": "K102PL01A0610",
                "WorkStationDesc": "淋雨检查"
            }, {"WorkStation": "K102PL01A0620", "WorkStationDesc": "厂内路试"}, {
                "WorkStation": "K102PL01A0630",
                "WorkStationDesc": "地沟检测"
            }, {"WorkStation": "K102PL01A0640", "WorkStationDesc": "四轮定位调整"}]
        }, {
            "ProductionLineNo": "K102SL02",
            "ProductionLineDesc": "智联重卡整车小件分装",
            "Data": [{"WorkStation": "K102SL02A0010", "WorkStationDesc": "小件分装"}]
        }, {
            "ProductionLineNo": "K102SL11",
            "ProductionLineDesc": "智联重卡整车前桥分装",
            "Data": [{"WorkStation": "K102SL11A0010", "WorkStationDesc": "前桥分装"}]
        }, {
            "ProductionLineNo": "K102SL14",
            "ProductionLineDesc": "智联重卡整车中桥分装",
            "Data": [{"WorkStation": "K102SL14A0010", "WorkStationDesc": "中桥分装"}]
        }, {
            "ProductionLineNo": "K102SL16",
            "ProductionLineDesc": "智联重卡整车后桥分装",
            "Data": [{"WorkStation": "K102SL16A0010", "WorkStationDesc": "后桥分装"}]
        }, {
            "ProductionLineNo": "K102SL25",
            "ProductionLineDesc": "智联重卡整车大件分装",
            "Data": [{"WorkStation": "K102SL25A0010", "WorkStationDesc": "大件分装"}]
        }, {
            "ProductionLineNo": "K102SL27",
            "ProductionLineDesc": "智联重卡整车发动机变速箱分装",
            "Data": [{"WorkStation": "K102SL27A0050", "WorkStationDesc": "风扇安装"}, {
                "WorkStation": "K102SL27A0060",
                "WorkStationDesc": "压缩机安装"
            }, {
                "WorkStation": "K102SL27A0070",
                "WorkStationDesc": "发动机后悬支架安装"
            }, {"WorkStation": "K102SL27A0080", "WorkStationDesc": "空压机盘管安装"}, {
                "WorkStation": "K102SL27A0090",
                "WorkStationDesc": "机油变速箱油加注"
            }, {"WorkStation": "K102SL27A0100", "WorkStationDesc": "进气钢管安装"}, {
                "WorkStation": "K102SL27A0110",
                "WorkStationDesc": "液缓管路安装1"
            }, {"WorkStation": "K102SL27A0120", "WorkStationDesc": "液缓管路安装2"}, {
                "WorkStation": "K102SL27A0130",
                "WorkStationDesc": "软轴固定发动机上线"
            }, {"WorkStation": "K102SL27A0040", "WorkStationDesc": "变速箱吊装"}, {
                "WorkStation": "K102SL27A0030",
                "WorkStationDesc": "离合器压盘安装"
            }, {
                "WorkStation": "K102SL27A0020",
                "WorkStationDesc": "发动机前悬支架安装"
            }, {"WorkStation": "K102SL27A0010", "WorkStationDesc": "发动机变速箱分装"}]
        }]
    }]
    callback(obj)
}
// 查询工位检验项列表
window.dataItem = function (Level, callback) {
    console.log(Level, '检验项查询参数');
    var data =
        {
            "code": "0",
            "msg": "查询成功",
            "orderStatus": 0,
            "workStation": "",
            "wipOrderNo": "8888888888",
            "productNo": "9999999999",
            "monthSequence": "8888-8888",
            "vin": "9999999999",
            "dispositionItem": [{
                "dispositionId": 101,
                "isConfig": 1,
                "dispositionDesc": "1112121111111111111111111111111121211111111111111111111111",
                "dxDesc": "11",
                "testAttribute": "NG",
                "testBy": "gw_wangzm26",
                "isHandle": 1,
                "handleReMark": "1",
                "handImgs": "",
                "handleBy": "gw_wangzm26",
                "isClose": 0,
                "confirmReMark": "",
                "confirmImgs": "",
                "confirmBy": ""
            }, {
                "dispositionId": 102,
                "isConfig": 0,
                "dispositionDesc": "2222222222222222",
                "dxDesc": "22",
                "testAttribute": "OK",
                "testBy": "gw_wangzm26",
                "isHandle": 0,
                "handleReMark": "1",
                "handImgs": "",
                "handleBy": "gw_wangzm26",
                "isClose": 0,
                "confirmReMark": "",
                "confirmImgs": "",
                "confirmBy": ""
            }],
            "questionItem": [{
                "questionId": 201,
                "question": "",
                "imgs": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg,https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                "testBy": "gw_wangzm26",
                "isHandle": 1,
                "handleReMark": "1",
                "handImgs": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                "handleBy": "gw_wangzm26",
                "isClose": 0,
                "confirmReMark": "",
                "confirmImgs": "",
                "confirmBy": ""
            }, {
                "questionId": 202,
                "question": "202",
                "imgs": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                "testBy": "gw_wangzm26",
                "isHandle": 1,
                "handleReMark": "1",
                "handImgs": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                "handleBy": "gw_wangzm26",
                "isClose": 0,
                "confirmReMark": "",
                "confirmImgs": "",
                "confirmBy": ""
            }]
        }
    callback(data);
};
// 保存或提交
window.InspectionOnlineSaveAndSubmit = function (data, callback) {
    // 入参 data
    let obj = {"code": "0", "message": "保存成功"}
    callback(obj)
}
window.questionAdd = function (data, callback) {
    // 入参 data
    let obj = {"questionId": 203, "testBy": "gw_wangzm26"}
    callback(obj)
}
window.questionDel = function (data, callback) {
    // 入参 data
    console.log(data, '测试数据');
    callback(data)
}
window.inspectionAdd = function (data, callback) {
    // 入参 data
    let obj = {"dispositionId": 103, "testBy": "gw_wangzm26"}
    callback(obj)
}
window.inspectionDel = function (data, callback) {
    // 入参 data
    console.log(data, '测试数据');
    callback(data)
}
// 保存图片
window.saveImgFils = function (params, callback) {
    callback({
        code: 0,
        data: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    })
}
window.pushFeiShu = function (data, callback) {
    callback({code: '0'})
}
window.InspectionOnlineSingleSave = function (data, callback) {
    // 入参 data
    let obj = {"code": "0", "message": "保存成功", "confirmBy": "gw_wangzm26"}
    callback(obj)
}