import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'babel-polyfill';

class ImageCrop extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      src: null,
      crop: {
        x: 10,
        y: 10,
        aspect: parseInt(props.aspectRatio),
        height: 250
      },
      croppedImageBase64String: '',
      showCropper: true
    };
    this.cropImage = this.cropImage.bind(this);
  }

  onImageDrop(files) {
    if (files[0]) {
      if (files[0].size > 4194304) {
        alert(this.props.errorMessage);
        return;
      }
      const reader = new FileReader();
      const self = this;
      reader.onload = function () {
        self.setState({
          src: reader.result,
          croppedImageUrl: null,
          showCropper: true
        });
      }
      reader.readAsDataURL(files[0]);
    }
  }

  onImageLoaded(image, pixelCrop) {
    this.imageRef = image;
  };

  async onCropComplete(crop, pixelCrop) {
    const croppedImageUrl = await this.getCroppedImg(
      this.imageRef,
      pixelCrop,
      "newFile.jpeg"
    );
    this.setState({ croppedImageUrl });
  };

  onCropChange(crop) {
    this.setState({ crop });
  };

  getCroppedImg(image, pixelCrop) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    const base64Image = canvas.toDataURL('image/jpeg');
    this.setState({
      croppedImageBase64String: base64Image
    });
  };

  cropImage(e) {
    e.preventDefault();
    this.setState({
      croppedImageUrl: this.state.croppedImageBase64String,
      showCropper: false
    });
  }

  render() {
    const { croppedImageUrl } = this.state;
    return (
      <div>
        <br />
        <Dropzone
          className="dropzone"
          multiple={false}
          accept="image/*"
          onDrop={this.onImageDrop.bind(this)}>
          <p className="padding-15">Dosyayı buraya sürükleyin <br /> ya da bu alana tıklayarak dosya seçin</p>
        </Dropzone>
        <button href="" onClick={this.cropImage} className="btn-crop">{this.props.buttonText}</button>
        <br />
        <input type="hidden" name={this.props.hiddenFieldName} value={this.state.croppedImageBase64String} />
        {this.state.src && this.state.showCropper && (
          <ReactCrop
            src={this.state.src}
            crop={this.state.crop}
            onImageLoaded={this.onImageLoaded.bind(this)}
            onComplete={this.onCropComplete.bind(this)}
            onChange={this.onCropChange.bind(this)}
          />
        )}
        {croppedImageUrl && <div><img className="cropped-image" alt="Crop" src={croppedImageUrl} /></div>}
      </div>
    );
  }
}

const domContainer = document.querySelector('#app');
const buttonText = domContainer.getAttribute('buttonText');
const hiddenFieldName = domContainer.getAttribute('hiddenFieldName');
const aspectRatio = domContainer.getAttribute('aspectRatio');
const errorMessage = domContainer.getAttribute('errorMessage');

ReactDOM.render(<ImageCrop aspectRatio={aspectRatio} buttonText={buttonText} hiddenFieldName={hiddenFieldName} errorMessage={errorMessage} />, domContainer);

module.hot.accept();