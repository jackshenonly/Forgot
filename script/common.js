﻿//var serverAddr = "http://192.168.0.116:9000";
//var serverAddr = "http://169.254.151.89:9000";
var serverAddr = "http://172.15.59.27:9000";
function openWin(name) {
	api.openWin({
		name : name,
		url : name + '.html',
		opaque : true,
		vScrollBarEnabled : false

	});
}

//user
function delWord(el) {
	var input = $api.prev(el, '.txt');
	input.value = '';
}

function edit(el) {
	var del = $api.next(el, '.del');
	if (el.value) {
		$api.addCls(del, 'show');
	}
	$api.addCls(el, 'light');
}

function cancel(el) {
	var del = $api.next(el, '.del');
	$api.removeCls(del, 'show');
	$api.removeCls(el, 'light');
}

function addData(data, str) {
	if (!data) {
		data = str;
	} else {
		if (data.indexOf(str) > -1) {
			return;
		} else {
			data = data + ',' + str;
		}
	}

	return data;
}

//favorite
function collect(el, type) {
	var uid = $api.getStorage('uid');
	//login
	if (!uid) {
		api.openWin({
			name : 'userLogin',
			url : './userLogin.html',
			opaque : true,
			vScrollBarEnabled : false
		});
		return;
	}

	//news id, activity id, merchant id
	var thisId = $api.attr(el, 'news-id') || $api.attr(el, 'act-id') || $api.attr(el, 'mer-id');

	var userFavUrl = '/user/' + uid + '/' + type;
	var bodyParam = {};
	switch (type) {
		case 'act_fav':
			bodyParam['activity'] = thisId;
			break;
		case 'news_fav':
			bodyParam['news'] = thisId;
			break;
		case 'mer_fav':
			bodyParam['merchant'] = thisId;
			break;
	}
	ajaxRequest(userFavUrl, 'post', JSON.stringify(bodyParam), function(ret, err) {
		if (ret) {
			$api.html(el, "已收藏");
			$(el).off('click').on('click', function() {
				uncollect(type, ret.id, this);
			})
		} else {
			api.toast({
				msg : '收藏失败'
			})
		}
	})
}

function uncollect(_class, id, el) {
	try {
		var deleteAct_favById = '/' + _class + '/' + id;
		ajaxRequest(deleteAct_favById, 'delete', '', function(ret, err) {
			if (ret) {
				$api.html(el, "收藏");
				$(el).off('click').on('click', function() {
					collect(this, _class);
				})
			} else {
				api.toast({
					msg : '操作失败'
				})
			}
		})
	} catch (e) {
		alert(e)
	}

}

/**
 * Created by Administrator on 2014/12/17.
 */
/**
 *
 *  Secure Hash Algorithm (SHA1)
 *  http://www.webtoolkit.info/
 *
 **/

function SHA1(msg) {

	function rotate_left(n, s) {
		var t4 = (n << s ) | (n >>> (32 - s));
		return t4;
	};

	function lsb_hex(val) {
		var str = "";
		var i;
		var vh;
		var vl;

		for ( i = 0; i <= 6; i += 2) {
			vh = (val >>> (i * 4 + 4)) & 0x0f;
			vl = (val >>> (i * 4)) & 0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};

	function cvt_hex(val) {
		var str = "";
		var i;
		var v;

		for ( i = 7; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;

	msg = Utf8Encode(msg);

	var msg_len = msg.length;

	var word_array = new Array();
	for ( i = 0; i < msg_len - 3; i += 4) {
		j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
		word_array.push(j);
	}

	switch (msg_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
			break;

		case 2:
			i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
			break;

		case 3:
			i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
			break;
	}

	word_array.push(i);

	while ((word_array.length % 16) != 14)
	word_array.push(0);

	word_array.push(msg_len >>> 29);
	word_array.push((msg_len << 3) & 0x0ffffffff);

	for ( blockstart = 0; blockstart < word_array.length; blockstart += 16) {

		for ( i = 0; i < 16; i++)
			W[i] = word_array[blockstart + i];
		for ( i = 16; i <= 79; i++)
			W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;

		for ( i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 20; i <= 39; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 40; i <= 59; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 60; i <= 79; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;

	}

	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

	return temp.toLowerCase();

}

function ajaxRequest(url, method, bodyParam, callBack) {
	var common_url = 'https://d.apicloud.com/mcm/api';
	var appId = 'A6963429484030';
	var key = '7F836F04-CAAC-52C8-2332-CF337134FA6F';
	var now = Date.now();
	var appKey = SHA1(appId + "UZ" + key + "UZ" + now) + "." + now;
	api.ajax({
		url : common_url + url,
		method : method,
		cache : false,
		timeout : 20,
		headers : {
			"Content-type" : "application/json;charset=UTF-8",
			"X-APICloud-AppId" : appId,
			"X-APICloud-AppKey" : appKey
		},
		data : {
			body : bodyParam
		}
	}, function(ret, err) {
		callBack(ret, err);
	});
}



var EARTH_RADIUS = 6378137.0;
//单位M
var PI = Math.PI;

function getRad(d) {
	return d * PI / 180.0;
}

/**
 * 由两个点的经纬度计算大致距离
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
	var radLat1 = getRad(lat1);
	var radLat2 = getRad(lat2);

	var a = radLat1 - radLat2;
	var b = getRad(lng1) - getRad(lng2);

	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000.0;

	return s;
} 