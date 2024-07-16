let mediaRecorder;
let recordedChunks = [];

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const preview = document.getElementById('preview');

startBtn.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: 'motion' },
    audio: false
  });

  preview.srcObject = stream;

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;


    mediaRecorder.onstop = async ()  => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'screen_recording.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        // send to server 
        const blob_ = new Blob(recordedChunks, { type: 'video/webm' });
        console.log(blob_);

        const formData = new FormData();
        formData.append('video', blob, 'screen_recording.webm');

        try {
            const response = await fetch('https://your-upload-endpoint-url', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
            console.log('Screen recording uploaded successfully.');
            } else {
            console.error('Failed to upload screen recording.');
            }
        } catch (error) {
            console.error('Error uploading screen recording:', error);
        }
    };
});

stopBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  preview.srcObject.getTracks().forEach(track => track.stop());
  startBtn.disabled = false;
  stopBtn.disabled = true;
console.log('stop');

});

