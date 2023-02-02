
/**
 * Decode base64 image
 *.e.g. data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAPAQMAAABeJUoFAAAABlBMVEX///8AAABVwtN+AAAAW0lEQVQImY2OMQrAMAwDjemgJ3jI0CFDntDBGKN3hby9bWi2UqrtkJAk8k/m5g4vGBCprKRxtzQR3mrMlm2CKpjIK0ZnKYiOjuUooS9ALpjV2AjiGY3Dw+Pj2gmnNxItbJdtpAAAAABJRU5ErkJggg==
 */

const decodeBase64Image = (dataurl, filename) => {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

export default decodeBase64Image;