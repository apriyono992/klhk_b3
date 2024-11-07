import RootLanding from "../../components/layouts/RootLanding";
import LayoutBeritaAndArticle from "../../components/fragments/landing/LayoutBeritaAndArticle";

export default function BeritaPage() {

      const dataBerita = [
        {
          title: 'tes',
          tgl_terbit: new Date().toJSON().slice(0, 10),
          author: 'reynald',
          category: 'Sosialisasi',
          img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          title: 'tes',
          tgl_terbit: new Date().toJSON().slice(0, 10),
          author: 'reynald',
          category: 'Sosialisasi',
          img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          title: 'tes',
          tgl_terbit: new Date().toJSON().slice(0, 10),
          author: 'reynald',
          category: 'Sosialisasi',
          img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          title: 'tes',
          tgl_terbit: new Date().toJSON().slice(0, 10),
          author: 'reynald',
          category: 'Sosialisasi',
          img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          title: 'tes',
          tgl_terbit: new Date().toJSON().slice(0, 10),
          author: 'reynald',
          category: 'Sosialisasi',
          img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          title: 'tes',
          tgl_terbit: new Date().toJSON().slice(0, 10),
          author: 'reynald',
          category: 'Sosialisasi',
          img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
      ]

    return (
        <RootLanding>
            <LayoutBeritaAndArticle title={'Berita Terkini'} dataBerita={dataBerita}/>
        </RootLanding>
    )
}