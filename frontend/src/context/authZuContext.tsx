import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import type { zuContextType } from "./zuContext";
import { useProfile } from "./zuContext";
import type { UserContextPayloadType } from "../types/userContextType"; import { authClient } from "../utility/auth-client";

type propType = {
	children: ReactNode;
};
type userSessionType = {
	email: string;
	emailVerified: boolean;
	image: string | null;
	name: string;
	id: string;
}

export default function AuthContext({ children }: propType) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const setProfile = useProfile((s : zuContextType)=>s.setProfile)	
	useEffect(() => {
		authClient.getSession().
			then(data => {
				const responseObj = data?.data?.user as userSessionType
				const toSetPayload: UserContextPayloadType = {
					loggedIn: false,
					email: responseObj?.email,
					id: responseObj?.id,
					userName: responseObj?.name,
					emailVerified: responseObj?.emailVerified,
					profilePicLink: responseObj?.image
				}
				if (data.data !== null) {
					toSetPayload.loggedIn = true
				}
				console.log(toSetPayload)
				setProfile(toSetPayload)
				setIsLoading(false)
			})
			.catch(err => {
				console.log(err)
				setIsLoading(false)// however later on show the user a 500 internal errpage
			})

	}, []);

	return (
		<>
		    {isLoading ? <TailSpin /> : children}
		</>
	);
}
