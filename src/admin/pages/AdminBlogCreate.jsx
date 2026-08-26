import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getBlogCreateData,
    createBlog
} from "../../services/adminService";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";


function AdminBlogCreate() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [baslik, setBaslik] = useState("");
    const [altbaslik, setAltbaslik] = useState("");
    const [aciklama, setAciklama] = useState("");
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false
            })
        ],
        content: aciklama,
        onUpdate: ({ editor }) => {
            setAciklama(editor.getHTML());
        }
    });

    const [resim, setResim] = useState(null);

    const [anasayfa, setAnasayfa] = useState(false);
    const [onay, setOnay] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const pageTopRef = useRef(null);

    useEffect(() => {

        async function fetchData() {

            try {

                const data = await getBlogCreateData();

                setCategories(data.data.categories);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }
        }

        fetchData();

    }, []);

    function handleCategoryChange(categoryId) {

        setSelectedCategories(previous => {

            if (previous.includes(categoryId)) {

                return previous.filter(
                    id => id !== categoryId
                );

            }

            return [...previous, categoryId];

        });

    }


    async function handleSubmit(event) {

        event.preventDefault();

        if (!editor || editor.isEmpty) {

            setError("Blog açıklaması boş bırakılamaz.");

            setTimeout(() => {
                pageTopRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 0);

            return;
        }

        setSubmitting(true);
        setError(null);

        try {

            await createBlog({
                baslik,
                altbaslik,
                aciklama,
                resim,
                anasayfa,
                onay,
                categories: selectedCategories
            });

            navigate("/admin/blogs");

        } catch (error) {

            setError(error.message);

            setTimeout(() => {
                    pageTopRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 0);

        } finally {

            setSubmitting(false);

        }
    }


    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">
                    Blog oluşturma bilgileri yükleniyor...
                </div>

            </div>
        );
    }

    function setLink() {

        if (!editor) {
            return;
        }

        const previousUrl = editor.getAttributes("link").href;

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

    return (
        <div className="admin-page">

            <div className="admin-page-header"
                ref={pageTopRef}
            >

                <div>

                    <h1>Blog Ekle</h1>

                    <p>
                        Yeni bir blog yazısı oluşturun.
                    </p>

                </div>

            </div>


            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}


            <form
                className="admin-form"
                onSubmit={handleSubmit}
            >

                <div className="admin-form-group">

                    <label htmlFor="baslik">
                        Başlık
                    </label>

                    <input
                        id="baslik"
                        type="text"
                        value={baslik}
                        onChange={event =>
                            setBaslik(event.target.value)
                        }
                        required
                    />

                </div>


                <div className="admin-form-group">

                    <label htmlFor="altbaslik">
                        Alt Başlık
                    </label>

                    <input
                        id="altbaslik"
                        type="text"
                        value={altbaslik}
                        onChange={event =>
                            setAltbaslik(event.target.value)
                        }
                    />

                </div>


                <div className="admin-form-group">

                    <label>
                        Açıklama
                    </label>

                    <div className="admin-editor">

                        <div className="admin-editor-toolbar">

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


                            <button
                                type="button"
                                className={
                                    editor?.isActive("heading", { level: 2 })
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run()
                                }
                            >
                                H2
                            </button>


                            <button
                                type="button"
                                className={
                                    editor?.isActive("heading", { level: 3 })
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleHeading({ level: 3 })
                                        .run()
                                }
                            >
                                H3
                            </button>


                            <span className="admin-editor-divider" />


                            <button
                                type="button"
                                className={
                                    editor?.isActive("bulletList")
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


                            <button
                                type="button"
                                className={
                                    editor?.isActive("orderedList")
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


                            <button
                                type="button"
                                className={
                                    editor?.isActive("blockquote")
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


                        <EditorContent
                            editor={editor}
                            className="admin-editor-content"
                        />

                    </div>

                </div>


                <div className="admin-form-group">

                    <label htmlFor="resim">
                        Blog Resmi
                    </label>

                    <input
                        id="resim"
                        type="file"
                        accept="image/*"
                        onChange={event =>
                            setResim(event.target.files[0] || null)
                        }
                    />

                </div>


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
                                    checked={selectedCategories.includes(
                                        category.categoryid
                                    )}
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


                <div className="admin-form-options">

                    <label className="admin-checkbox">

                        <input
                            type="checkbox"
                            checked={anasayfa}
                            onChange={event =>
                                setAnasayfa(event.target.checked)
                            }
                        />

                        <span>
                            Anasayfada göster
                        </span>

                    </label>


                    <label className="admin-checkbox">

                        <input
                            type="checkbox"
                            checked={onay}
                            onChange={event =>
                                setOnay(event.target.checked)
                            }
                        />

                        <span>
                            Onaylandı
                        </span>

                    </label>

                </div>


                <div className="admin-form-actions">

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => navigate("/admin/blogs")}
                    >
                        Vazgeç
                    </button>

                    <button
                        type="submit"
                        className="admin-primary-button"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Oluşturuluyor..."
                            : "Blog Oluştur"
                        }
                    </button>

                </div>

            </form>

        </div>
    );
} 

export default AdminBlogCreate;