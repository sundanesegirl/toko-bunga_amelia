/* Nomor WhatsApp toko*/
const amelia_whatsapp_number = "085156567953";
function amelia_format_whatsapp(number) {
    let clean = String(number || "").replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "62" + clean.slice(1);
    if (clean.startsWith("8")) clean = "62" + clean;
    return clean;
}
function amelia_open_whatsapp(message) {
    const url = "https://wa.me/" + amelia_format_whatsapp(amelia_whatsapp_number) + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
}

const amelia_products = {
 "Soft Hour": {slug:"soft-hour",category:"KOLEKSI LEMBUT / AR-01",desc:"Buket bernuansa dusty pink yang lembut dan romantis, cocok untuk menyampaikan perhatian dengan cara sederhana.",price:285000,image:"foto/softhour.jpeg",gallery:["foto/softhour.jpeg","foto/lembut.jpeg","foto/detail1.jpeg"]},
 "Sun Theory": {slug:"sun-theory",category:"KOLEKSI CERAH / AR-02",desc:"Rangkaian bernuansa kuning dan gold yang cerah, membawa energi hangat untuk momen spesial.",price:320000,image:"foto/suntheory.jpeg",gallery:["foto/suntheory.jpeg","foto/cerah.jpeg","foto/mix.jpeg"]},
 "Afterglow": {slug:"afterglow",category:"KOLEKSI ROMANTIS / AR-03",desc:"Rangkaian bunga bernuansa dusty pink dan burgundy yang hangat. Dirancang untuk menyampaikan perasaan tanpa perlu banyak kata.",price:350000,image:"foto/afterglow.jpeg",gallery:["foto/afterglow.jpeg","foto/detail1.jpeg","foto/detail2.jpeg"]},
 "Pure Form": {slug:"pure-form",category:"KOLEKSI LEMBUT / AR-04",desc:"Buket putih dan ivory dengan tampilan minimalis, elegan, dan timeless.",price:245000,image:"foto/pureform.jpeg",gallery:["foto/pureform.jpeg","foto/ivory.jpeg","foto/detail2.jpeg"]},
 "Sunday Celebration": {slug:"sunday-celebration",category:"KOLEKSI PERAYAAN / AR-05",desc:"Buket penuh warna untuk merayakan momen bahagia dan membuat hari terasa lebih istimewa.",price:395000,image:"foto/mix.jpeg",gallery:["foto/mix.jpeg","foto/cerah.jpeg","foto/detail1.jpeg"]},
 "Velvet Crush": {slug:"velvet-crush",category:"KOLEKSI ROMANTIS / AR-06",desc:"Buket dengan warna pink dan sentuhan romantis yang manis, untuk hadiah penuh makna.",price:420000,image:"foto/pink.jpeg",gallery:["foto/pink.jpeg","foto/romantis.jpeg","foto/detail2.jpeg"]},
 "Wild Thing": {slug:"wild-thing",category:"KOLEKSI BERANI / AR-07",desc:"Rangkaian dengan karakter warna yang berani dan ekspresif, cocok untuk hadiah yang berbeda.",price:310000,image:"foto/burgundy.jpeg",gallery:["foto/burgundy.jpeg","foto/afterglow.jpeg","foto/detail1.jpeg"]},
 "Cloud Nine": {slug:"cloud-nine",category:"KOLEKSI LEMBUT / AR-08",desc:"Buket bernuansa ivory dan lembut yang terasa ringan, manis, dan elegan.",price:275000,image:"foto/ivory.jpeg",gallery:["foto/ivory.jpeg","foto/lembut.jpeg","foto/detail2.jpeg"]}
};
function amelia_find_product_by_slug(slug) { return Object.values(amelia_products).find(p => p.slug === slug); }
function amelia_format_price(price) { return "Rp" + Number(price).toLocaleString("id-ID"); }
function amelia_get_cart() { try { return JSON.parse(localStorage.getItem("amelia_cart_items") || "[]"); } catch(e) { return []; } }
function amelia_save_cart(cart) { localStorage.setItem("amelia_cart_items", JSON.stringify(cart)); }
function amelia_cart_count_value(cart) { return cart.reduce((sum,item)=>sum + Number(item.qty||0),0); }
function amelia_add_to_cart(productName, price, qty, size, image) {
    const cart=amelia_get_cart(); const key=productName+"|"+size;
    const existing=cart.find(item=>item.key===key);
    if(existing) existing.qty+=qty;
    else cart.push({key,name:productName,price:Number(price),qty:Number(qty),size:size||"Regular",image:image||amelia_products[productName]?.image||"foto/afterglow.jpeg"});
    amelia_save_cart(cart); amelia_update_cart_badges(); amelia_render_cart();
}
function amelia_update_cart_badges() {
    const cart=amelia_get_cart(); const count=amelia_cart_count_value(cart);
    document.querySelectorAll("#amelia_cart_count").forEach(el=>el.textContent=count);
    localStorage.setItem("amelia_cart_count",String(count));
}
function amelia_render_cart() {
    const body=document.getElementById("amelia_cart_body"); if(!body) return;
    const cart=amelia_get_cart();
    if(cart.length===0){body.innerHTML='<p class="amelia_cart_empty">Keranjang masih kosong. Yuk pilih bunga favoritmu.</p><div class="amelia_cart_summary"><span>Total</span><span>Rp0</span></div>';return;}
    let total=0;
    body.innerHTML=cart.map((item,index)=>{total+=item.price*item.qty;return `<div class="amelia_cart_item"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>${item.size} · ${item.qty} buah</p><p>${amelia_format_price(item.price)} / buket</p><button class="amelia_cart_remove" type="button" data-remove="${index}">Hapus</button></div><strong>${amelia_format_price(item.price*item.qty)}</strong></div>`;}).join('')+`<div class="amelia_cart_summary"><span>Total sementara</span><span>${amelia_format_price(total)}</span></div><p class="amelia_cart_empty">Ongkir dan konfirmasi ketersediaan akan dibicarakan melalui WhatsApp.</p><button type="button" class="amelia_button amelia_button_dark amelia_cart_checkout" id="amelia_cart_checkout">CHECKOUT VIA WHATSAPP</button>`;
    body.querySelectorAll("[data-remove]").forEach(button=>button.addEventListener("click",()=>{const updated=amelia_get_cart();updated.splice(Number(button.dataset.remove),1);amelia_save_cart(updated);amelia_update_cart_badges();amelia_render_cart();}));
    const checkout=document.getElementById("amelia_cart_checkout"); if(checkout) checkout.addEventListener("click",amelia_checkout_cart);
}
function amelia_checkout_cart() {
    const cart=amelia_get_cart(); if(!cart.length)return;
    let total=0; let lines=cart.map((item,i)=>{let subtotal=item.price*item.qty;total+=subtotal;return `${i+1}. ${item.name} (${item.size})\n   Jumlah: ${item.qty}\n   Harga: ${amelia_format_price(item.price)}\n   Subtotal: ${amelia_format_price(subtotal)}`;});
    const message=`Halo AMÉLIA RYUL! Saya ingin checkout pesanan:\n\n${lines.join("\n\n")}\n\nTOTAL SEMENTARA: ${amelia_format_price(total)}\n\nMohon konfirmasi ketersediaan, ongkir, dan cara pembayaran. Terima kasih.`;
    amelia_open_whatsapp(message);
}
// Header menu mobile
const amelia_menu_toggle=document.getElementById("amelia_menu_toggle"); const amelia_nav=document.getElementById("amelia_nav");
if(amelia_menu_toggle&&amelia_nav){amelia_menu_toggle.addEventListener("click",function(){amelia_nav.classList.toggle("amelia_nav_open");const opened=amelia_nav.classList.contains("amelia_nav_open");amelia_menu_toggle.setAttribute("aria-expanded",opened);amelia_menu_toggle.setAttribute("aria-label",opened?"Tutup menu navigasi":"Buka menu navigasi");});amelia_nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{amelia_nav.classList.remove("amelia_nav_open");amelia_menu_toggle.setAttribute("aria-expanded","false");}));}
// Cart modal is injected into each page for a shared cart experience.
const amelia_cart_overlay=document.createElement("div"); amelia_cart_overlay.className="amelia_cart_overlay"; amelia_cart_overlay.id="amelia_cart_overlay"; amelia_cart_overlay.hidden=true; amelia_cart_overlay.innerHTML='<section class="amelia_cart_panel" role="dialog" aria-modal="true" aria-labelledby="amelia_cart_title"><div class="amelia_cart_head"><h2 id="amelia_cart_title">Keranjang</h2><button class="amelia_cart_close" id="amelia_cart_close" aria-label="Tutup keranjang" type="button">×</button></div><div id="amelia_cart_body"></div></section>';document.body.appendChild(amelia_cart_overlay);
const cartOpen=document.getElementById("amelia_cart_open"), cartClose=document.getElementById("amelia_cart_close");if(cartOpen)cartOpen.addEventListener("click",()=>{amelia_render_cart();amelia_cart_overlay.hidden=false;});if(cartClose)cartClose.addEventListener("click",()=>amelia_cart_overlay.hidden=true);amelia_cart_overlay.addEventListener("click",e=>{if(e.target===amelia_cart_overlay)amelia_cart_overlay.hidden=true;});document.addEventListener("keydown",e=>{if(e.key==="Escape")amelia_cart_overlay.hidden=true;});amelia_update_cart_badges();
// Shop filtering/sorting
const amelia_shop_grid=document.getElementById("amelia_shop_products");if(amelia_shop_grid){const search=document.getElementById("amelia_product_search"),category=document.getElementById("amelia_category_filter"),sort=document.getElementById("amelia_sort_products"),result=document.getElementById("amelia_product_result"),noProducts=document.getElementById("amelia_no_products"),cards=Array.from(amelia_shop_grid.querySelectorAll(".amelia_product_card"));function update(){let visible=cards.filter(card=>(card.dataset.name.toLowerCase().includes(search.value.toLowerCase()))&&(category.value==="all"||card.dataset.category===category.value));if(sort.value==="low")visible.sort((a,b)=>+a.dataset.price-+b.dataset.price);else if(sort.value==="high")visible.sort((a,b)=>+b.dataset.price-+a.dataset.price);else if(sort.value==="name")visible.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name));cards.forEach(c=>c.hidden=true);visible.forEach(c=>{c.hidden=false;amelia_shop_grid.appendChild(c);});result.textContent=visible.length+" produk";noProducts.hidden=visible.length!==0;}search.addEventListener("input",update);category.addEventListener("change",update);sort.addEventListener("change",update);
    cards.forEach(card=>{const product=amelia_products[card.dataset.name];if(product){card.querySelectorAll('a[href="product.html"]').forEach(a=>a.href="product.html?product="+product.slug);}});
    amelia_shop_grid.querySelectorAll(".amelia_add_button").forEach(button=>button.addEventListener("click",()=>{const name=button.dataset.product,product=amelia_products[name];if(!product)return;amelia_add_to_cart(name,product.price,1,"Regular",product.image);const original=button.textContent;button.textContent="DITAMBAHKAN ✓";setTimeout(()=>button.textContent=original,1100);}));}
// Load selected product into shared detail page, based on product query from shop card.
const detailAdd = document.getElementById("amelia_detail_add");

if (detailAdd) {
    const params = new URLSearchParams(location.search);
    const product = amelia_find_product_by_slug(params.get("product")) || amelia_products["Afterglow"];
    const name = Object.keys(amelia_products).find(k => amelia_products[k] === product);

    const mainImage = document.getElementById("amelia_detail_main_image");
    const title = document.querySelector(".amelia_detail_info h1");
    const eyebrow = document.querySelector(".amelia_detail_info .amelia_eyebrow");
    const description = document.querySelector(".amelia_detail_desc");
    const price = document.getElementById("amelia_detail_price");
    const size = document.getElementById("amelia_size");
    const qty = document.getElementById("amelia_quantity");
    const feedback = document.getElementById("amelia_detail_feedback");

    if (title) title.textContent = name;
    if (eyebrow) eyebrow.textContent = product.category;
    if (description) description.textContent = product.desc;

    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = "Buket " + name;
    }

    const thumbs = document.querySelectorAll(".amelia_thumb");

    thumbs.forEach((t, i) => {
        const img = product.gallery[i] || product.image;
        t.dataset.image = img;

        const inner = t.querySelector("img");
        if (inner) inner.src = img;

        t.classList.toggle("active", i === 0);
        t.setAttribute("aria-label", "Foto " + (i + 1) + " buket " + name);
    });

    if (size) {
        size.innerHTML = `
            <option value="${product.price}">Regular — ${amelia_format_price(product.price)}</option>
            <option value="${Math.round(product.price * 1.35 / 5000) * 5000}">
                Large — ${amelia_format_price(Math.round(product.price * 1.35 / 5000) * 5000)}
            </option>
            <option value="${Math.round(product.price * 1.75 / 5000) * 5000}">
                Grand — ${amelia_format_price(Math.round(product.price * 1.75 / 5000) * 5000)}
            </option>
        `;
    }

    // Memperbarui harga berdasarkan ukuran
    function updatePrice() {
        if (price && size) {
            price.textContent = amelia_format_price(size.value);
        }
    }

    if (size) size.addEventListener("change", updatePrice);
    updatePrice();

    // Tombol jumlah produk
    const minus = document.getElementById("amelia_qty_minus");
    const plus = document.getElementById("amelia_qty_plus");

    if (minus) {
        minus.addEventListener("click", () => {
            qty.value = Math.max(1, Number(qty.value) - 1);
        });
    }

    if (plus) {
        plus.addEventListener("click", () => {
            qty.value = Math.min(10, Number(qty.value) + 1);
        });
    }

    if (qty) {
        qty.addEventListener("change", () => {
            qty.value = Math.max(1, Math.min(10, Number(qty.value) || 1));
        });
    }

    // Tombol tambah ke keranjang
    detailAdd.addEventListener("click", () => {
        const quantity = Math.max(1, Number(qty.value) || 1);
        const selectedSize = size.options[size.selectedIndex].text.split(" — ")[0];

        // Menambahkan produk ke keranjang
        amelia_add_to_cart(
            name,
            Number(size.value),
            quantity,
            selectedSize,
            product.image
        );

        // Menampilkan notifikasi berhasil
        if (feedback) {
            feedback.textContent =
                `✓ Berhasil! ${quantity} buket ${name} (${selectedSize}) ditambahkan ke keranjang.`;
        }

        // Mengembalikan jumlah ke kondisi awal
        qty.value = 1;

        // Mengembalikan ukuran ke Regular
        size.selectedIndex = 0;

        // Memperbarui harga
        updatePrice();
    });

    // Mengganti foto utama melalui thumbnail
    document.querySelectorAll(".amelia_thumb").forEach(thumb => {
        thumb.addEventListener("click", () => {
            mainImage.src = thumb.dataset.image;

            document.querySelectorAll(".amelia_thumb").forEach(t => {
                t.classList.remove("active");
            });

            thumb.classList.add("active");
        });
    });
}

// Custom bouquet form to WhatsApp
const customForm=document.getElementById("amelia_custom_form");if(customForm)customForm.addEventListener("submit",event=>{event.preventDefault();const name=document.getElementById("amelia_custom_name").value,wa=document.getElementById("amelia_custom_whatsapp").value,occasion=document.getElementById("amelia_custom_occasion").value,color=document.getElementById("amelia_custom_color").value,budget=document.getElementById("amelia_custom_budget").value,notes=document.getElementById("amelia_custom_notes").value;amelia_open_whatsapp(`Halo AMÉLIA RYUL! Saya ingin memesan buket kustom.\nNama: ${name}\nNomor WhatsApp: ${wa}\nMomen: ${occasion}\nWarna: ${color}\nBudget: ${budget}\nDetail: ${notes||"-"}`);document.getElementById("amelia_custom_feedback").textContent="WhatsApp terbuka untuk melanjutkan permintaan buket kustom.";});
const contactLink=document.getElementById("amelia_contact_whatsapp_link");if(contactLink){contactLink.href="https://wa.me/"+amelia_format_whatsapp(amelia_whatsapp_number);contactLink.target="_blank";contactLink.rel="noopener";}
const contactForm=document.getElementById("amelia_contact_form");if(contactForm)contactForm.addEventListener("submit",event=>{event.preventDefault();const name=document.getElementById("amelia_contact_name").value,wa=document.getElementById("amelia_contact_whatsapp").value,subject=document.getElementById("amelia_contact_subject").value,message=document.getElementById("amelia_contact_message").value;amelia_open_whatsapp(`Halo AMÉLIA RYUL!\nNama: ${name}\nNomor WhatsApp: ${wa}\nTopik: ${subject}\nPesan: ${message}`);document.getElementById("amelia_contact_feedback").textContent="WhatsApp terbuka untuk melanjutkan pesan.";});
// Journal article modal
const journalModal=document.getElementById("amelia_journal_modal");if(journalModal){const modalTitle=document.getElementById("amelia_modal_title"),modalContent=document.getElementById("amelia_modal_content"),close=document.getElementById("amelia_journal_close");document.querySelectorAll(".amelia_journal_read").forEach(button=>button.addEventListener("click",()=>{modalTitle.textContent=button.dataset.title;modalContent.textContent=button.dataset.content;journalModal.hidden=false;}));close.addEventListener("click",()=>journalModal.hidden=true);journalModal.addEventListener("click",event=>{if(event.target===journalModal)journalModal.hidden=true;});document.addEventListener("keydown",event=>{if(event.key==="Escape")journalModal.hidden=true;});}

// General product-detail links: resolve product name from surrounding card/title or image alt.\ndocument.querySelectorAll('a[href="product.html"]').forEach(link=>{if(link.closest('.amelia_product_card'))return;const parent=link.closest('article, .amelia_product_info, .amelia_related_grid a, .amelia_collection_card');const candidate=[link.textContent,link.querySelector('img')?.alt,parent?.textContent].filter(Boolean).join(' ').trim();const productName=Object.keys(amelia_products).find(name=>candidate.toLowerCase().includes(name.toLowerCase()));if(productName)link.href='product.html?product='+amelia_products[productName].slug;});
