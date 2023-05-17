import s from "./style.module.css";
import {useCallback, useEffect, useState} from "react";
import {RepoService} from "../../services/RepoService";

export const UpdateRepo = ({id,visible, setVisible}) =>
{
    const [repoName, setRepoName] = useState("");
    const [status, setStatus] = useState();

    const typeHandle = useCallback((e) => {
        setRepoName(e.target.value)
    },[]);

    const updateRepoHandle = useCallback(async ()=>{
        const response = await RepoService.updateRepo(id,repoName)
        setStatus(response?.status)
        if (status && status !== 201)
            alert(`Error: ` + status);
    }, [status, repoName]);

    useEffect(() => {
        if (status === 201)
            setVisible(false)
    }, [status, setVisible])

    if (visible)
        return <div className={s.modal} onClick={() => setVisible(false)}>
            <div className={s.content} onClick={e => e.stopPropagation()}>
                <label>Имя героя: <input type="text" onChange={typeHandle}/></label>
                <button onClick={updateRepoHandle}>Update</button>
            </div>
        </div>


}