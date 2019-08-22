<script>
  import Button from "../UI/Button.svelte";
  import Badge from "../UI/Badge.svelte";

  export let menus;
  let title="";
  let newTitle="";
  let mainMenu = "";
  let mainMenuNames = "";
  let subdatas = "";
  let maindatas = "";
  let subdatatitle = "";
  let maindatatitle = "";
  $ : promiseMain=LoadMainData();
  $ : promiseDetail=setTimeout(function(){ QueryMainData(newTitle); }, 500);
    
  async function LoadMainData() {
        // Main Menu List
    const responseMainMenu = await fetch("http://localhost:5500/mainmenu");
    const jsonMain = await responseMainMenu.json();
    menus.mainmenu = jsonMain;
    mainMenu = menus.mainmenu;
    }

    async function QueryMainData(data) {
    const reqData = data;
    // Main Menu İtems
    const url = await `http://localhost:5500/mainmenu/${reqData}`;
    const resData = await fetch(url);
    const jsonData = await resData.json();
    menus.maindatas=await jsonData[0].items;
    maindatatitle = await jsonData[0].caption;
    maindatas = menus.maindatas;
  }

    async function QuerySubData(data) {
      const reqData = data;
    // Sub Menu İtems
    const url = await `http://localhost:5500/submenu/${reqData}`;
    const resData = await fetch(url);
    const jsonData = await resData.json();
    menus.subdatas=jsonData[0].items;
    subdatatitle = jsonData[0].description;
    subdatas = menus.subdatas;
    console.log(subdatas);
  }

  function updateMenu(e) {
    newTitle=e.target.value;
    console.log(newTitle);
   }

  // function addToBasketOnce(e) {
  //   console.log(e.target.value + ' is added to basket')
  //   isAddedToBasket=!isAddedToBasket;
  // }


  function showSubMenu(e) {
    e.forEach(element => {
      QuerySubData(element);
    });
   }

</script>

  {#await promiseMain}
  <p>...Loading</p>
  {:then}
  <h1 style="padding-left:30px;">Ana Menü</h1>
  <h2 style="padding-left:30px;">Lütfen Siparişinizi Oluşturun</h2>
  <aside id="menus">
    {#each mainMenu as menu  (menu.name)}
  <article>
  <header>
    <h1>{menu.name}</h1>
  </header>
  <div class="image">
    <img src={menu.image} alt={menu.name} />
  </div>
    <Button type="button" value={menu.name} on:click={updateMenu}>Menüyü Görüntüle</Button>
  </article>
  {/each}
  </aside>
  {:catch error}
	<p style="color: red">{error.message}</p>
  {/await}


  {#await promiseDetail}
  <p>...Loading</p>
  {:then}
  <aside id="subMenu">
  {#each maindatas as mainData (mainData.name)}
  <article>
  <header>
    <h1>
      {mainData.name}
      {#if mainData.isAdded}
        <Badge>EKLENDİ</Badge>
      {/if}
    </h1>
    <h2>
    {maindatatitle}
      {#if mainData.isAdded&&maindatatitle!="İndirimli Menüler"}
        <Badge>{mainData.price} TL</Badge>
      {/if}
    </h2>
  </header>
  <div class="image">
    <img src={mainData.image} alt={mainData.name} />
  </div>
    <Button type="button" value={mainData.name} on:click={() => mainData.isAdded=!mainData.isAdded} >{mainData.isAdded ? 'Sepetten Çıkar' : 'Sepete Ekle'}</Button>    
  {#if mainData.isAdded && mainData.subMenus}
    <Button type="button" value={mainData.subMenus} on:click={() => showSubMenu(mainData.subMenus)}>Alt Menüleri Listele</Button>    
  {/if}
  </article>
  {/each}
  </aside>
  {:catch error}
	<p style="color: red">{error.message}</p>
  {/await}


<style>
  #menus {
    float:left;
    width: 50%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }
    #subMenu {
    float:right;
    width: 50%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }
  @media (min-width: 768px) {
    #menus {
      grid-template-columns: repeat(2, 1fr);
    }    
    #subMenu {
      grid-template-columns: repeat(2, 1fr);
    }
  }
    article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 2rem;
  }

  header
  {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }
  

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }
</style>