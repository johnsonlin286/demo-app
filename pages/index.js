import { useState } from "react";
import Header from "../components/header";
import GalleryGrid from "../components/gallery-grid";
import ThumbnailImg from "../components/thumbnail-img";
import BottomSheet from "../components/bottomsheet";
import PhotoPreview from "../components/photo-preview";

export default function Home() {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  
  const renderGalleryItem = () => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(
        <ThumbnailImg key={i} src="https://via.placeholder.com/180" alt={`img-${i}`} onClick={() => setShowBottomSheet(true)}/>
      );
    }
    return arr
  }

  return (
    <div className="home">
      <Header fixed title={'Title'}/>
      <div className="pt-14 pb-20">
        <GalleryGrid>
          {
            renderGalleryItem()
          }
        </GalleryGrid>
      </div>
      <BottomSheet
        open={showBottomSheet}
        onDismiss={() => setShowBottomSheet(false)}
      >
        <PhotoPreview/>
      </BottomSheet>
    </div>
  )
}
