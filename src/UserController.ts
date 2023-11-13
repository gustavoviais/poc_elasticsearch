import { Request, Response } from "express";
import { Config, names, uniqueNamesGenerator } from 'unique-names-generator';
import getClient from "./client/elasticsearch";


class UserController {

  async create(request: Request, response: Response) {
    const config: Config = {
      dictionaries: [names]
    }
    
    for(let i=0; i<1000; i++){
      const firstName: string = uniqueNamesGenerator(config);
      const lastName: string = uniqueNamesGenerator(config);

      await getClient().index({
        index: 'users',
        type: 'type_users',
        body: {
          name: `${firstName} ${lastName}`
        }
      }, (error) => {
        if(error) {
          return response.status(400).json({error})
        }
      });
    }

    return response.json({ message: 'Users created!'})
  }

  async findAll(request: Request, response: Response) {

    const dataInicial = new Date().getTime();

    const data = await getClient().search({
      index: 'users',
      size: 6000
    });

    const dataFinal = new Date().getTime();

    console.log(`Tempo de execução da busca: ${(dataFinal - dataInicial)}`);

    return response.json(data);
  }


  async findById(request: Request, response: Response) {

    const { id }  = request.params;
    
    const data = await getClient().search({
      index: 'users',
      q: `_id:${id}`
    });

    return response.json(data.hits.hits)
  }

  async findByQuery(request: Request, response: Response) {

    const data = await getClient().search({
      index: 'users',
      body: {
        query: {
          term: {
            "name.keyword": 'Karlen Laryssa'
          }
        }
      },
    })

    return response.json(data?.hits?.hits);
  }

}

export default new UserController;