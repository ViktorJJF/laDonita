<template>
  <header class="header">
    <div class="container-fluid">
      <!-- Row start -->
      <div class="row gutters">
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4">
          <a href="index-2.html" class="logo"
            >La Doñita <span>campestre</span></a
          >
        </div>
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8">
          <!-- Header actions start -->
          <ul class="header-actions">
            <li class="dropdown">
              <a
                href="#"
                id="userSettings"
                class="user-settings"
                data-toggle="dropdown"
                aria-haspopup="true"
              >
                <span class="user-name">{{
                  $store.getters['authModule/user']
                }}</span>
                <span class="avatar">NR<span class="status busy"></span></span>
              </a>
              <div
                class="dropdown-menu dropdown-menu-right"
                aria-labelledby="userSettings"
              >
                <div class="header-profile-actions">
                  <div class="header-user-profile">
                    <div class="header-user">
                      <img src="img/user5.png" alt="Royal Hospitals Admin" />
                    </div>
                    <h5>Nélson Romyo</h5>
                    <p>Admin</p>
                  </div>
                  <a href="hospital-add-doctor.html"
                    ><i class="icon-user1"></i> My Profile</a
                  >
                  <a href="account-settings.html"
                    ><i class="icon-settings1"></i> Account Settings</a
                  >
                  <a href="hospital-reviews.html"
                    ><i class="icon-activity"></i> Activity Logs</a
                  >
                  <a href="login.html"
                    ><i class="icon-log-out1"></i> Sign Out</a
                  >
                </div>
              </div>
            </li>
          </ul>
          <!-- Header actions end -->
        </div>
      </div>
      <!-- Row end -->
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
