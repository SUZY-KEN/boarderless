self.onmessage = function(event) {
    const { markerData, pinImage, urlSearchParams } = event.data;
    const markers = [];

    markerData.forEach(data => {
        const pinDefault = pinImage.cloneNode(true);
        const marker = {
            position: { lat: data.lat, lng: data.lng },
            content: pinDefault,
            title: "spotId" + data.id,
            zIndex: 1,
        };

        // URLの判定
        if (data.id == urlSearchParams.get('spotId')) {
            const pinSelected = pinImage.selected.cloneNode(true);
            marker.content = pinSelected;
            marker.zIndex = 2;
        }

        markers.push(marker);
    });

    // メインスレッドに生成したマーカーを送信
    self.postMessage(markers);
};