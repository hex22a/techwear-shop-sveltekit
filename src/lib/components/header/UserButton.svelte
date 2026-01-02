<div class="relative">
	<Link class="block md:hidden" href="/signin">
		<UserPic />
	</Link>
	<button onClick={toggleMiniSignIn} class="hidden md:block">
		<UserPic />
	</button>
	{isMiniSignInVisible &&
	<div class="absolute top-10 right-0 w-72 bg-black text-white rounded-xl shadow-lg p-4">
		{session ?
			<button onClick={() => signOut()} class="w-full border border-white rounded-full text-white">Sign Out</button>
			:
			<WebauthnForm />
		}
	</div>
	}
</div>
