/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */

(function() {
//TODO: does this actually decode and encode itself? important to know because bitwise logic (I have never used bitwise stuff before, but I'm loving the challenge of trying to learn it)
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	//initalizes a variable called base64EncodeChars
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	//initalizes an array called base64DecodeChars with all these values

function base64encode(str) {
	//in js, functions are like methods. this is a method that takes in str, based on the following code, I am assuming str is an array
    var out, i, len;
	//initilizes the variables out, i, and len
    var c1, c2, c3;
	//initalizes the variables c1, c2, and c3

    len = str.length;
	//sets len to the length of the string array
    i = 0;
	//sets i equal to zero 
    out = "";
	//makes out a character
    while(i < len) {
	    //while length is greater then i this happens, the following stuff increments i so this should get through all the elements of the array
	c1 = str.charCodeAt(i++) & 0xff;
	    // sets c1 to the Unicode of the character at the specified index, i, in the string
	    //& is a bitwise and meaning it expects two numbers and returns a number, if they are not numbers, they are cast into numbers 
	    //0xff takes only the least significant 8 bits of what's returned by .charCodeAt 
	if(i == len)
		//if i equals the length of the str array, this happens (lots of magic concatenating stuff)
	{
		//REMEMBER += adds it the the "out" variable, concatanating 
	    out += base64EncodeChars.charAt(c1 >> 2);		
		//.charAt returns the value of the string at the specified space
		// >> is a sign propagating right shift, it shifts the c1 in the binary representation 2 bits to the right, discarding bits shifted off
		
	    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
		//bitwise operation again
		//remember a bitwise and essentially replaces the value of c1 with the value of 0x3 
		//<< is a left shift, it shifts c1 in binary representation 0x3 bits to the left, shifting 0s from the right
	    out += "==";
		//adds == to the end of the char out
	    break;
		//breaks out of the if statement, I'm not sure why this is needed unless I'm misunderstanding an if statement. 
	}
	c2 = str.charCodeAt(i++);
	    //assigns c2 to the value of str at the Unicode of the character at the specified index, i, in a string.
	if(i == len)
		//if i is greater then the length of str, this happens
		//should continue the origional concating of the out variable
	{
	    out += base64EncodeChars.charAt(c1 >> 2);
		//.charAt returns the value of the string at the specified space
		// >> is a sign propagating right shift, it shifts the c1 in the binary representation 2 bits to the right, discarding bits shifted off
	    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		// | is a bitwise or and returns a 1 in each bit position for which the corresponding bits of either or both operands are 1s.
		// 0xF0 is another piece of bitwise number magic. I feel like now is a good time to mention I'm not too familiar with bitwise operations
		// remember & is a bitwise AND and it esentailly switches the bitwise value with the variable value
	    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
		// << is a left shift, it shifts c1 in binary representation 0x3 bits to the left, shifting 0s from the right

	    out += "=";
		//adds = to the end of the char/string, TODO: need to look to see if it was actually initilizing a char up there 
	    break;
	}
	c3 = str.charCodeAt(i++);
	    //.charCodeAt returns the Unicode of the character at the specified index in a string
	out += base64EncodeChars.charAt(c1 >> 2);
	    //shifts the binary representation of c1 2 bits to the left and continues concating out based on base64EncodeChars, specifically the value located at this index
	out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	  
	out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
	out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
	/* c1 */
	do {
	    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	} while(i < len && c1 == -1);
	if(c1 == -1)
	    break;

	/* c2 */
	do {
	    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	} while(i < len && c2 == -1);
	if(c2 == -1)
	    break;

	out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

	/* c3 */
	do {
	    c3 = str.charCodeAt(i++) & 0xff;
	    if(c3 == 61)
		return out;
	    c3 = base64DecodeChars[c3];
	} while(i < len && c3 == -1);
	if(c3 == -1)
	    break;

	out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

	/* c4 */
	do {
	    c4 = str.charCodeAt(i++) & 0xff;
	    if(c4 == 61)
		return out;
	    c4 = base64DecodeChars[c4];
	} while(i < len && c4 == -1);
	if(c4 == -1)
	    break;
	out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

if (!window.btoa) window.btoa = base64encode;
if (!window.atob) window.atob = base64decode;

})();
