import axios from 'axios';

import * as ENV from '../../ENV';
import Level from '../../models/Level';

export const READ_LEVELS = 'READ_LEVELS';
export const CREATE_LEVEL = 'CREATE_LEVEL';
export const DELETE_LEVEL = 'DELETE_LEVEL';
export const UPDATE_LEVEL = 'UPDATE_LEVEL'

export const create = (formData) => {
    return async (dispatch, getState) => {
        // any async code you want
        try{
            const response = await axios({
                method: 'POST',
                url: `${ENV.HOST}/level-api/create`,
                headers: ENV.HEADERS,
                data: formData
            });
            const resData = await response.data;
            
            const levelData = JSON.parse(resData.level);
            dispatch({
                type: CREATE_LEVEL,
                data: levelData
            });
        }catch(err){
            throw err;
        }
    }
}

export const read = (page = 1, pagination = true) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${ENV.HOST}/api/levels?page=${page}&pagination=${pagination}`,
                headers: ENV.HEADERS
            });
            if(response.status != 200){
                throw new Error(ENV.ERRORDESC);
            }
            const resData = await response.data['hydra:member'];
            const totalData = await response.data['hydra:totalItems'];

            let levelsData = resData.map(level => new Level(level.id, level['@id'], level.title, level.description, level.createdBy, level.createdAtAgo, level.updatedAtAgo));

            dispatch({
                type: READ_LEVELS,
                data: levelsData,
                count: totalData
            });
        } catch (err){
            throw err;
        }
    }
}

export const update = (id, formData) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `${ENV.HOST}/level-api/update/${id}`,
                headers: ENV.HEADERS,
                data: formData
            });

            const resData = await response.data;
            
            const levelData = JSON.parse(resData.level);
            dispatch({
                type: UPDATE_LEVEL,
                data: levelData
            });
        }catch(err){
            throw err;
        }
    }
}

export const destroy = (iris) => {
    return async (dispatch, getState) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${ENV.HOST}/level-api/delete`,
                headers: ENV.HEADERS,
                data: iris
            });
            const resData = await response.data;

            dispatch({
                type: DELETE_LEVEL,
                data: iris
            });
        }catch (err){
            throw err;
        }
    }
}