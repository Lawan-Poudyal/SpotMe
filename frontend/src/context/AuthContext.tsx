import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { UserContext } from "./UserContext";
import { TailSpin } from "react-loader-spinner";
import type { UserContextPayloadType } from "../types/userContextType";
import { authClient } from "../utility/auth-client";

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
	const [contextState, setContextState] = useState<UserContextPayloadType | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

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
				console.log(toSetPayload.id)
				setContextState(toSetPayload)
				setIsLoading(false)
			})
			.catch(err => {
				console.log(err)
				setIsLoading(false)// however later on show the user a 500 internal errpage
			})

	}, []);

	return (
		<UserContext.Provider value={{ contextState, setContextState }}>
			{isLoading ? <TailSpin /> : children}
		</UserContext.Provider>
	);
}
