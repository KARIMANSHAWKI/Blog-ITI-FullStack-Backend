exports.smartTrim = (str, length, delim, appendix) => {
    if(str.length <= length) return str;

    var trimmedStr = str.substr(0, length+delim.length)

    var lastDelimedIndex = trimmedStr.lastIndexOf(delim);

    if (lastDelimedIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimedIndex)

    if(trimmedStr) trimmedStr += appendix;

    return trimmedStr;
}