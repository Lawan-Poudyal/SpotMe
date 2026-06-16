import {useState , useEffect} from "react"
import SearchBar from "../components/SearchBar"
import AddButton from "../components/AddButton"
import FolderCard from "../components/Folder";
import AddEvent from "../components/Addfolder"; 
import DeleteEventModal from "../components/DeleteEvent";
import EditNameModal from "../components/ChangeEvent";
import PopUpBox from "../components/PopupBox";
import type { eventType } from "../types/eventType";
import { onGetEvent } from "../utility/eventUtils";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

export default function HomePage(){
    const [searchQuery , setSearchQuery] = useState<string>("")
    const [events , setEvents] = useState<eventType[]>([])
    const [isAddEventOpen , setIsAddEventOpen] = useState<boolean>(false)
    const [isDeleteEventModalOpen , setIsDeleteEventModalOpen] = useState<boolean>(false)
    const [isChangeEventModalOpen , setIsChangeEventModalOpen] = useState<boolean>(false)
    const [selectedEventId,  setSelectedEventId] = useState<string | null>(null)
    const [selectedEventName,  setSelectedEventName] = useState<string |null>(null)
    const [titleError , setTitleError] = useState<string>("")
    const [subTitleError , setSubTitleError] = useState<string>("")
    const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false)
    const userContext = useContext(UserContext) 
    useEffect(()=>{
	onGetEvent(setTitleError , setSubTitleError , setIsErrorOpen , setEvents, userContext?.contextState?.id as string)
    }, [])

    const handleRemoveButtonPressed = (eventId : string , eventName : string)=>{
	setSelectedEventId(eventId)
	setSelectedEventName(eventName)
	setIsDeleteEventModalOpen(true)
    }
    const handleChangeEventButtonPressed = (eventId : string , eventName : string)=>{
	setSelectedEventId(eventId)
	setSelectedEventName(eventName)
	setIsChangeEventModalOpen(true)
    }
    
    const handleOnCloseAddEvent = ()=>{
	setIsAddEventOpen(false)
    }
    const handleOnCloseDeleteEvent = ()=>{
	setIsDeleteEventModalOpen(false)
    }
    const handleOnChangeEvent = ()=>{
	setIsChangeEventModalOpen(false)
    }
    return(
	<div className="bg-white flex-1 p-2 flex flex-col flex-nowrap">
	<PopUpBox title={titleError as string} subTitle={subTitleError as string} open={isErrorOpen} setOpen={setIsErrorOpen}/>
	<AddEvent open={isAddEventOpen}  onClose={handleOnCloseAddEvent} events={events} setTitleError={setTitleError} setSubTitleError={setSubTitleError} setIsErrorOpen={setIsErrorOpen} setEvents={setEvents} userId={userContext?.contextState?.id as string} />	
    open,
    onClose,
    events,
    setTitleError,
    setSubTitleError,
    setIsErrorOpen,
    setEvents,
    currentName,
    userId,
    eventId
    <DeleteEventModal 
	open={isDeleteEventModalOpen}
	onClose = {handleOnCloseDeleteEvent}
	events = {events}
	setTitleError={setTitleError}
	setSubTitleError={setSubTitleError}
	setIsErrorOpen={setIsErrorOpen}
	setEvents={setEvents}
	eventName={selectedEventName as string}
	userId = {userContext?.contextState?.id as string}
	eventId = {selectedEventId as string}
    />
	<EditNameModal open={isChangeEventModalOpen} onClose={handleOnChangeEvent} eventId={selectedEventId as string} currentName={selectedEventName as string} events={events} setTitleError={setTitleError} setSubTitleError={setSubTitleError} setIsErrorOpen={setIsErrorOpen} setEvents={setEvents} userId={userContext?.contextState?.id as string} />
	{
	(events.length ===0) ?
	<div className="h-full w-full flex flex-col justify-center items-center gap-5">
	    <h1 className="text-gray-500">Ohh! looking like you are missing your events click add to add your events</h1>
	   <AddButton setOpen={setIsAddEventOpen}/>
	</div> 
	: 
	<>
	<div className="w-full flex flex-row justify-between">	
	    <SearchBar query={searchQuery} setQuery={setSearchQuery}/> 
	    <AddButton setOpen={setIsAddEventOpen}/>
	</div>
	<div
      className="
        grid
        grid-cols-5
        gap-4
        p-4"
    >
    {
	(events.map(item=>
	   <FolderCard name={item.eventName} key={item.id} onRemove={()=>{handleRemoveButtonPressed(item.id,item.eventName)}} onEdit={()=>{
	       handleChangeEventButtonPressed(item.id, item.eventName)
	   }}/> 
	))
    }
    </div>
    </>
    }
	</div>
    )
}
