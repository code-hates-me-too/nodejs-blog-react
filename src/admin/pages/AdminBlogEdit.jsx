import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getBlogEditData,
    updateBlog
} from "../../services/adminService";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";


function AdminBlogEdit() {

    const navigate = useNavigate();
    const { blogid } = useParams();

    const pageTopRef = useRef(null);

    const [categories, setCategories] = useState([]);

    const [baslik, setBaslik] = useState("");
    const [altbaslik, setAltbaslik] = useState("");
    const [aciklama, setAciklama] = useState("");

    const [resim, setResim] = useState(null);
    const [eskiResim, setEskiResim] = useState("");

    const [resimKaldir, setResimKaldir] = useState(false);

    const [anasayfa, setAnasayfa] = useState(false);
    const [onay, setOnay] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // İçerik editöre bir kez basıldı mı, kullanıcı yazmaya başladıktan
    // sonra tekrar üzerine yazıp imleci/geçmişi bozmasın diye.
    const contentInitialized = useRef(false);


    /*
     * =========================================================
     * TIPTAP
     * =========================================================
     */

    const editor = useEditor({
        extensions: [
            StarterKit,

            Link.configure({
                openOnClick: false
            })
        ],

        content: "",

        onUpdate: ({ editor }) => {
            setAciklama(editor.getHTML());
        }
    });


    /*
     * =========================================================
     * BLOG VERİSİNİ GETİR (sadece blogid değişince)
     * =========================================================
     */

    useEffect(() => {

        let isCancelled = false;

        async function fetchData() {

            try {

                const data = await getBlogEditData(blogid);

                if (isCancelled) return;

                const blog = data.blog;

                setCategories(data.categories || []);

                setBaslik(blog.baslik || "");
                setAltbaslik(blog.altbaslik || "");
                setAciklama(blog.aciklama || "");

                setEskiResim(blog.resim || "");

                setAnasayfa(Boolean(blog.anasayfa));
                setOnay(Boolean(blog.onay));

                const blogCategories = blog.categories || [];

                setSelectedCategories(
                    blogCategories.map(category => category.categoryid)
                );

                // içerik basma işini artık burada YAPMIYORUZ,
                // aşağıdaki ayrı effect editor hazır olduğunda halledecek

            } catch (err) {

                if (!isCancelled) setError(err.message);

            } finally {

                if (!isCancelled) setLoading(false);

            }
        }

        contentInitialized.current = false;
        fetchData();

        return () => {
            isCancelled = true;
        };

    }, [blogid]);


    /*
     * =========================================================
     * EDİTÖRE İÇERİĞİ BAS
     * editor hazır VE veri gelmiş olmalı, sadece bir kez çalışır
     * =========================================================
     */

    useEffect(() => {

        if (!editor || editor.isDestroyed) return;
        if (loading) return;
        if (contentInitialized.current) return;

        editor.commands.setContent(aciklama || "");
        contentInitialized.current = true;

    }, [editor, loading, aciklama]);


    /*
     * =========================================================
     * HATA OLDUĞUNDA SAYFANIN ÜSTÜNE ÇIK
     * =========================================================
     */

    useEffect(() => {

        if (!error) return;

        setTimeout(() => {
            pageTopRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 0);

    }, [error]);


    /*
     * =========================================================
     * KATEGORİ
     * =========================================================
     */

    function handleCategoryChange(categoryId) {

        setSelectedCategories(previous => {

            if (previous.includes(categoryId)) {

                return previous.filter(
                    id => id !== categoryId
                );

            }

            return [
                ...previous,
                categoryId
            ];

        });

    }


    /*
     * =========================================================
     * RESİM
     * =========================================================
     */

    function handleImageChange(event) { 

        const file =
            event.target.files[0] || null;

        setResim(file);

        /*
         * Yeni resim seçildiyse
         * resim kaldır seçeneğini kapat.
         */

        if (file) {
            setResimKaldir(false);
        }

    }


    /*
     * =========================================================
     * LINK
     * =========================================================
     */

    function setLink() {

        if (!editor) {
            return;
        }

        const previousUrl =
            editor.getAttributes("link").href;

        const url = window.prompt(
            "Bağlantı adresi:",
            previousUrl || ""
        );

        if (url === null) {
            return;
        }

        if (url === "") {

            editor
                .chain()
                .focus()
                .unsetLink()
                .run();

            return;
        }

        editor
            .chain()
            .focus()
            .setLink({ href: url })
            .run();

    }


    /*
     * =========================================================
     * FORM GÖNDER
     * =========================================================
     */

    async function handleSubmit(event) {

        event.preventDefault();


        /*
         * Editör hazır değilse işlem yapma.
         */

        if (!editor) {

            setError(
                "Editör henüz hazır değil."
            );

            return;
        }


        /*
         * Açıklama boş mu?
         */

        if (editor.isEmpty) {

            setError(
                "Blog açıklaması boş bırakılamaz."
            );

            return;
        }


        setSubmitting(true);
        setError(null);


        try {

            await updateBlog(blogid, {

                baslik,
                altbaslik,
                aciklama,
                resim,
                eskiResim,
                resimKaldir,
                anasayfa,
                onay,
                categories: selectedCategories

            });


            navigate("/admin/blogs");


        } catch (error) {

            setError(error.message);

        } finally {

            setSubmitting(false);

        }

    }


    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">
                    Blog bilgileri yükleniyor...
                </div>

            </div>
        );

    }


    /*
     * =========================================================
     * SAYFA
     * =========================================================
     */

    return (
        <div className="admin-page">


            {/* =================================================
                BAŞLIK
            ================================================= */}

            <div
                className="admin-page-header"
                ref={pageTopRef}
            >

                <div>

                    <h1>
                        Blog Düzenle
                    </h1>

                    <p>
                        Blog yazısını düzenleyin.
                    </p>

                </div>

            </div>


            {/* =================================================
                HATA
            ================================================= */}

            {error && (

                <div className="admin-error">

                    {error}

                </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="admin-form"
                onSubmit={handleSubmit}
            >


                {/* =================================================
                    BAŞLIK
                ================================================= */}

                <div className="admin-form-group">

                    <label htmlFor="baslik">
                        Başlık
                    </label>

                    <input
                        id="baslik"
                        type="text"
                        value={baslik}
                        onChange={event =>
                            setBaslik(
                                event.target.value
                            )
                        }
                        required
                    />

                </div>


                {/* =================================================
                    ALT BAŞLIK
                ================================================= */}

                <div className="admin-form-group">

                    <label htmlFor="altbaslik">
                        Alt Başlık
                    </label>

                    <input
                        id="altbaslik"
                        type="text"
                        value={altbaslik}
                        onChange={event =>
                            setAltbaslik(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* =================================================
                    AÇIKLAMA / TIPTAP
                ================================================= */}

                <div className="admin-form-group">

                    <label>
                        Açıklama
                    </label>

                    <div className="admin-editor">


                        {/* TOOLBAR */}

                        <div className="admin-editor-toolbar">


                            {/* BOLD */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive("bold")
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleBold()
                                        .run()
                                }
                            >
                                B
                            </button>


                            {/* ITALIC */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive("italic")
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleItalic()
                                        .run()
                                }
                            >
                                I
                            </button>


                            {/* STRIKE */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive("strike")
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleStrike()
                                        .run()
                                }
                            >
                                S
                            </button>


                            <span className="admin-editor-divider" />


                            {/* H2 */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive(
                                        "heading",
                                        { level: 2 }
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleHeading({
                                            level: 2
                                        })
                                        .run()
                                }
                            >
                                H2
                            </button>


                            {/* H3 */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive(
                                        "heading",
                                        { level: 3 }
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleHeading({
                                            level: 3
                                        })
                                        .run()
                                }
                            >
                                H3
                            </button>


                            <span className="admin-editor-divider" />


                            {/* BULLET LIST */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive(
                                        "bulletList"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                            >
                                • Liste
                            </button>


                            {/* ORDERED LIST */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive(
                                        "orderedList"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                            >
                                1. Liste
                            </button>


                            {/* BLOCKQUOTE */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive(
                                        "blockquote"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                }
                            >
                                Alıntı
                            </button>


                            <span className="admin-editor-divider" />


                            {/* LINK */}

                            <button
                                type="button"
                                className={
                                    editor?.isActive("link")
                                        ? "active"
                                        : ""
                                }
                                onClick={setLink}
                            >
                                Link
                            </button>


                            {/* LINK KALDIR */}

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .unsetLink()
                                        .run()
                                }
                            >
                                Link kaldır
                            </button>

                        </div>


                        {/* EDITOR */}

                        <EditorContent
                            editor={editor}
                            className="admin-editor-content"
                        />

                    </div>

                </div>


                {/* =================================================
                    RESİM
                ================================================= */}

                <div className="admin-form-group">

                    <label>
                        Blog Resmi
                    </label>


                    {/* MEVCUT RESİM */}

                    {eskiResim && (

                        <div className="admin-current-image">

                            <img
                                src={`http://localhost:3000/static/images/${eskiResim}`}
                                alt={baslik}
                            />

                        </div>

                    )}


                    {/* RESİM KALDIR */}

                    {eskiResim && (

                        <label className="admin-checkbox">

                            <input
                                type="checkbox"
                                checked={resimKaldir}
                                onChange={event =>
                                    setResimKaldir(
                                        event.target.checked
                                    )
                                }
                            />

                            <span>
                                Mevcut resmi kaldır
                            </span>

                        </label>

                    )}


                    {/* YENİ RESİM */}

                    <input
                        id="resim"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                </div>


                {/* =================================================
                    KATEGORİLER
                ================================================= */}

                <div className="admin-form-group">

                    <span className="admin-form-label">
                        Kategoriler
                    </span>

                    <div className="admin-category-list">

                        {categories.map(category => (

                            <label
                                key={category.categoryid}
                                className="admin-category-option"
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        selectedCategories.includes(
                                            category.categoryid
                                        )
                                    }
                                    onChange={() =>
                                        handleCategoryChange(
                                            category.categoryid
                                        )
                                    }
                                />

                                <span>
                                    {category.categoryname}
                                </span>

                            </label>

                        ))}

                    </div>

                </div>


                {/* =================================================
                    SEÇENEKLER
                ================================================= */}

                <div className="admin-form-options">


                    {/* ANASAYFA */}

                    <label className="admin-checkbox">

                        <input
                            type="checkbox"
                            checked={anasayfa}
                            onChange={event =>
                                setAnasayfa(
                                    event.target.checked
                                )
                            }
                        />

                        <span>
                            Anasayfada göster
                        </span>

                    </label>


                    {/* ONAY */}

                    <label className="admin-checkbox">

                        <input
                            type="checkbox"
                            checked={onay}
                            onChange={event =>
                                setOnay(
                                    event.target.checked
                                )
                            }
                        />

                        <span>
                            Onaylandı
                        </span>

                    </label>

                </div>


                {/* =================================================
                    BUTONLAR
                ================================================= */}

                <div className="admin-form-actions">


                    {/* VAZGEÇ */}

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() =>
                            navigate("/admin/blogs")
                        }
                    >
                        Vazgeç
                    </button>


                    {/* KAYDET */}

                    <button
                        type="submit"
                        className="admin-primary-button"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Kaydediliyor..."
                            : "Değişiklikleri Kaydet"
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}


export default AdminBlogEdit;