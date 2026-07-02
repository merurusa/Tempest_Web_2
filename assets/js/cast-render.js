(function () {
  const data = window.TempestCastData;
  if (!data) return;

  const params = new URLSearchParams(window.location.search);
  const shopStyles = {
    various: { a: '#24394a', b: '#a63f54', logoA: '#b8d7ff', logoB: '#2f75ff' },
    solomon: { a: '#fff4fb', b: '#c86a9f', logoA: '#ffffff', logoB: '#ffb8dc' },
    lively: { a: '#161014', b: '#c41e2b', logoA: '#ffd27a', logoB: '#d81f2a' },
    charme: { a: '#1a1022', b: '#7d2fb1', logoA: '#f2d2ff', logoB: '#b243ff' },
    strive: { a: '#0c1118', b: '#3aa7d5', logoA: '#f1f7ff', logoB: '#67d8ff' },
    ebichanchi: { a: '#fff2d8', b: '#e2472f', logoA: '#fff0c7', logoB: '#e2472f' }
  };
  const escapeHtml = (value) => String(value || '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  const getImage = (shopId, cast) => cast.image || data.shops[shopId].placeholder;
  const profileUrl = (shopId, castId) => `cast-profile.html?shop=${encodeURIComponent(shopId)}&id=${encodeURIComponent(castId)}`;

  function renderCastList(root) {
    const shopId = root.dataset.shop;
    const shop = data.shops[shopId];
    const casts = data.casts[shopId] || [];
    if (!shop) return;

    document.title = `Cast | ${shop.name}`;
    const title = document.querySelector('[data-cast-title]');
    const eyebrow = document.querySelector('[data-cast-eyebrow]');
    if (title) title.textContent = 'Cast';
    if (eyebrow) eyebrow.textContent = shop.name;

    root.innerHTML = casts.map((cast, index) => {
      const isManager = index === 0;
      const cardClass = isManager ? 'cast-profile manager' : 'cast-profile';
      const emptyClass = cast.available ? '' : ' is-empty';
      return `
        <a class="${cardClass}${emptyClass}" href="${profileUrl(shopId, cast.id)}" aria-label="${escapeHtml(cast.name)}の個人ページへ">
          <div class="cast-image-slot"><img src="${escapeHtml(getImage(shopId, cast))}" alt="${escapeHtml(cast.name)}"></div>
          <div class="cast-profile-body">
            <p class="eyebrow">${escapeHtml(cast.role)}</p>
            <h2>${escapeHtml(cast.name)}</h2>
            <p>${cast.available ? 'プロフィール準備中' : '空き枠'}</p>
          </div>
        </a>`;
    }).join('');
  }

  function renderCastProfile(root) {
    const shopId = params.get('shop') || root.dataset.shop;
    const castId = params.get('id') || root.dataset.cast;
    const shop = data.shops[shopId];
    const cast = shop && (data.casts[shopId] || []).find((item) => item.id === castId);
    if (!shop || !cast) {
      root.innerHTML = '<section class="cast-detail"><p class="eyebrow">Cast</p><h1>Cast not found</h1><p>キャスト情報が見つかりません。</p></section>';
      return;
    }

    document.body.classList.add(`shop-${shopId}`);
    const colors = shopStyles[shopId];
    if (colors) {
      document.body.style.setProperty('--shop-a', colors.a);
      document.body.style.setProperty('--shop-b', colors.b);
      document.body.style.setProperty('--logo-a', colors.logoA);
      document.body.style.setProperty('--logo-b', colors.logoB);
    }
    document.title = `${cast.name} | ${shop.name}`;
    const backToShop = document.querySelector('[data-back-shop]');
    const backToCast = document.querySelector('[data-back-cast]');
    if (backToShop) backToShop.href = shop.page;
    if (backToCast) backToCast.href = shop.castPage;

    root.innerHTML = `
      <section class="cast-detail${cast.available ? '' : ' is-empty'}">
        <div class="cast-detail-image"><img src="${escapeHtml(getImage(shopId, cast))}" alt="${escapeHtml(cast.name)}"></div>
        <div class="cast-detail-body">
          <p class="eyebrow">${escapeHtml(shop.name)} / ${escapeHtml(cast.role)}</p>
          <h1>${escapeHtml(cast.name)}</h1>
          <p>${cast.available ? '個人紹介ページの本文をここに追加できます。' : '現在準備中の空き枠です。'}</p>
          <div class="cast-detail-actions"><a class="button primary" href="${escapeHtml(shop.castPage)}">Cast一覧へ</a><a class="button secondary" href="${escapeHtml(shop.page)}">店舗ページへ</a></div>
        </div>
      </section>`;
  }

  document.querySelectorAll('[data-cast-list]').forEach(renderCastList);
  document.querySelectorAll('[data-cast-profile]').forEach(renderCastProfile);
}());

